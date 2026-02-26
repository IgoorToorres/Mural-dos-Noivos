// src/app/api/recordacoes/pdf/route.ts
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const MAX_PER_PDF = 50; // 50 por arquivo costuma ficar bem equilibrado
const MAX_TOTAL = 1000; // limite de segurança

function onlyHour(date: Date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function chunkArray<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function fetchImageBytes(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const contentType = res.headers.get('content-type') ?? '';
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { bytes, contentType };
}

function wrapText(text: string, maxCharsPerLine: number) {
  const clean = (text ?? '').trim();
  if (!clean) return [''];

  const lines: string[] = [];
  const words = clean.split(/\s+/);

  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxCharsPerLine) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildPdf(posts: any[], part: number, totalParts: number) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // A4 (pt)
  const W = 595.28;
  const H = 841.89;
  const M = 40;

  let page = pdfDoc.addPage([W, H]);
  let y = H - M;

  // Header
  page.drawText(`Recordações do casamento — parte ${part}/${totalParts}`, {
    x: M,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 26;

  page.drawText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, {
    x: M,
    y,
    size: 10,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });
  y -= 18;

  const cardGap = 14;
  const cardPadding = 12;
  const cardW = W - M * 2;

  const imageMaxH = 180;
  const imageMaxW = cardW - cardPadding * 2;

  for (const post of posts) {
    const needsImage = Boolean(post.imagePath);
    const estimatedCardH =
      (needsImage ? imageMaxH + 10 : 0) + 84 + cardPadding * 2;

    if (y - estimatedCardH < M) {
      page = pdfDoc.addPage([W, H]);
      y = H - M;
    }

    const cardTop = y;
    const cardH = estimatedCardH;
    const cardY = cardTop - cardH;

    // Card container
    page.drawRectangle({
      x: M,
      y: cardY,
      width: cardW,
      height: cardH,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.88, 0.88, 0.88),
      borderWidth: 1,
    });

    let cx = M + cardPadding;
    let cy = cardTop - cardPadding;

    // Image embed
    if (post.imagePath) {
      try {
        const { bytes, contentType } = await fetchImageBytes(post.imagePath);

        // pdf-lib só embute jpg/png nativamente
        let img: any = null;
        if (contentType.includes('png')) img = await pdfDoc.embedPng(bytes);
        else if (contentType.includes('jpeg') || contentType.includes('jpg'))
          img = await pdfDoc.embedJpg(bytes);

        if (img) {
          const { width, height } = img.scale(1);
          const scale = Math.min(imageMaxW / width, imageMaxH / height);
          const w = width * scale;
          const h = height * scale;

          const imgX = M + (cardW - w) / 2;
          const imgY = cy - h;

          page.drawImage(img, { x: imgX, y: imgY, width: w, height: h });
          cy = imgY - 10;
        } else {
          page.drawText('[Formato de imagem não suportado]', {
            x: cx,
            y: cy - 12,
            size: 10,
            font,
            color: rgb(0.5, 0.2, 0.2),
          });
          cy -= 26;
        }
      } catch {
        page.drawText('[Imagem indisponível]', {
          x: cx,
          y: cy - 12,
          size: 10,
          font,
          color: rgb(0.5, 0.2, 0.2),
        });
        cy -= 26;
      }
    }

    // Name + hour
    const time = onlyHour(new Date(post.createdAt));
    const name = post.name?.trim() || 'Convidado';
    page.drawText(`${name} • ${time}`, {
      x: cx,
      y: cy - 14,
      size: 12,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.12),
    });
    cy -= 22;

    // Message
    const lines = wrapText(post.message ?? '', 92).slice(0, 10);
    page.drawRectangle({
      x: cx,
      y: cardY + cardPadding,
      width: cardW - cardPadding * 2,
      height: 56,
      color: rgb(0.0, 0.0, 0.0),
      opacity: 0.03,
    });

    let ty = cy - 4;
    for (const line of lines) {
      page.drawText(line, {
        x: cx + 10,
        y: ty,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      ty -= 14;
    }

    y = cardY - cardGap;
  }

  return pdfDoc.save();
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: MAX_TOTAL,
    select: {
      id: true,
      name: true,
      message: true,
      imagePath: true,
      createdAt: true,
    },
  });

  if (posts.length === 0) {
    return NextResponse.json(
      { message: 'Sem recordações para exportar' },
      { status: 400 }
    );
  }

  const chunks = chunkArray(posts, MAX_PER_PDF);
  const totalParts = chunks.length;

  const zip = new JSZip();

  for (let i = 0; i < chunks.length; i++) {
    const pdfBytes = await buildPdf(chunks[i], i + 1, totalParts);
    const filename = `recordacoes-${String(i + 1).padStart(2, '0')}.pdf`;
    zip.file(filename, pdfBytes);
  }

  // Melhor compatibilidade com NextResponse: usar arraybuffer
  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="recordacoes-casamento.zip"',
      'Cache-Control': 'no-store',
    },
  });
}

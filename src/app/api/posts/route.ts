import { prisma } from '@/lib/prisma';
import { createPostSchema } from '@/schemas/post.schema';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        name: data.name,
        message: data.message,
        imagePath: data.imagePath ?? null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? 'Erro ao Enviar o formulário' },
      { status: 400 }
    );
  }
}

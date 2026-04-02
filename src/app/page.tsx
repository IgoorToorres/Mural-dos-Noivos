import { getPosts } from '@/lib/posts';
import MuralClient from './mural-client';
import QRCode from 'qrcode';

export default async function Home() {
  const posts = await getPosts();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
  const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/formulario`, {
    width: 256,
    margin: 1,
  });

  return (
    <main className="relative h-dvh overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background-secondary">
        <img
          src={'background.png'}
          alt="Foto de fundo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Content - TV optimized */}
      <section className="relative z-10 flex h-full w-full flex-col p-5">
        {/* Top bar: Couple photo + QR Code */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-5">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-accent-cream/60 shadow-lg">
              <img
                src={'/Natan-Bia.jpeg'}
                alt="Foto do casal"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground drop-shadow-sm">
                Mural de Fotos
              </h1>
              <p className="text-sm text-content-secondary">
                Envie sua foto e apareça aqui!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-accent-cream/80 px-6 py-3 shadow-lg backdrop-blur-sm">
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="h-24 w-24 rounded-lg object-cover"
            />
            <p className="max-w-45 text-center text-sm font-semibold leading-tight text-foreground">
              Aponte sua câmera e mande sua foto ao casal
            </p>
          </div>
        </div>

        {/* Photo Grid - main focus (auto-refresh) */}
        <MuralClient initialPosts={posts} />
      </section>
    </main>
  );
}

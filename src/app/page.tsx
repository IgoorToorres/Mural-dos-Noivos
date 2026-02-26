import { getPosts } from '@/lib/posts';

export default async function Home() {
  const posts = await getPosts();
  const photos = posts.filter((post) => post.imagePath);
  const carouselItems = [...photos, ...photos];

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
              src={'/download.png'}
              alt="QR Code"
              className="h-24 w-24 rounded-lg object-cover"
            />
            <p className="max-w-45 text-center text-sm font-semibold leading-tight text-foreground">
              Aponte sua câmera e mande sua foto ao casal
            </p>
          </div>
        </div>

        {/* Photo Grid - main focus */}
        <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden pb-4">
          {photos.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border-secondary bg-background-tertiary p-12 text-center text-base text-content-secondary">
              As primeiras fotos aparecerão aqui assim que forem enviadas.
            </div>
          ) : (
            <>
              {/* Row 1 - scrolls left */}
              <div className="overflow-hidden rounded-3xl">
                <div className="photo-marquee flex w-max gap-4">
                  {carouselItems.map((post, index) => (
                    <div
                      key={`row1-${post.id}-${post.createdAt}-${index}`}
                      className="h-[38vh] w-[38vh] shrink-0 overflow-hidden rounded-2xl shadow-lg"
                    >
                      <img
                        src={post.imagePath ?? ''}
                        alt="Foto enviada ao mural"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 - scrolls right (reverse) */}
              <div className="overflow-hidden rounded-3xl">
                <div className="photo-marquee-reverse flex w-max gap-4">
                  {[...carouselItems].reverse().map((post, index) => (
                    <div
                      key={`row2-${post.id}-${post.createdAt}-${index}`}
                      className="h-[38vh] w-[38vh] shrink-0 overflow-hidden rounded-2xl shadow-lg"
                    >
                      <img
                        src={post.imagePath ?? ''}
                        alt="Foto enviada ao mural"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

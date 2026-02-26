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
      </div>

      {/* Content */}
      <section className="relative z-10 flex h-full w-full flex-col items-center justify-center p-5">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Couple Photo */}
          <div className="flex h-100 w-full items-center justify-center rounded-3xl">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img
                src={'/Natan-Bia.jpeg'}
                alt="Foto do casal"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex h-100 w-full flex-col items-center justify-center gap-6 rounded-3xl bg-accent-cream-strong/10 p-8 ">
            <img
              src={'/download.png'}
              alt="QR Code"
              className="h-58 w-58 rounded-xl object-cover shadow-md"
            />
            <h1 className="text-center text-3xl font-bold text-foreground md:text-2xl">
              Aponte sua câmera e mande sua mensagem ao casal
            </h1>
          </div>
        </div>

        {/* Photo Carousel */}
        <div className="mt-8 w-full max-w-full">
          {photos.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border-secondary bg-background-tertiary p-12 text-center text-base text-content-secondary">
              As primeiras fotos aparecerão aqui assim que forem enviadas.
            </div>
          ) : (
            <div className="photo-marquee overflow-hidden rounded-3xl p-6">
              <div className="photo-marquee-track gap-6">
                {carouselItems.map((post, index) => (
                  <div
                    key={`${post.id}-${post.createdAt}-${index}`}
                    className="h-72 w-72 shrink-0 overflow-hidden rounded-3xl transition-transform"
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
          )}
        </div>
      </section>
    </main>
  );
}

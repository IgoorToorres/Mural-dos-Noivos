import CardPost from '@/components/card-post/card-post';
import { getPosts } from '@/lib/posts';

export default async function Recordacoes() {
  const posts = await getPosts();

  return (
    <main className="min-h-dvh bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Recordações do casamento
          </h1>
          <p className="text-sm text-foreground/70">
            Fotos e mensagens enviadas pelos convidados.
          </p>
        </header>

        <section className="rounded-2xl bg-background/40 p-3 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <CardPost key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-base font-medium">Ainda não tem nada aqui</p>
              <p className="text-sm text-foreground/70">
                Seja o primeiro a enviar uma foto ou mensagem.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

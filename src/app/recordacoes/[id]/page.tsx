// app/recordacoes/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getPostById } from '@/lib/posts';
import DeleteButton from './delete-button';

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  const createdAt = new Date(post.createdAt);

  return (
    <main className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/recordacoes"
            className="text-sm text-foreground/70 hover:text-foreground hover:underline"
          >
            ← Voltar
          </Link>
          <span className="text-xs text-foreground/60">Recordação</span>
        </div>

        <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {post.imagePath && (
            <div className="relative w-full overflow-hidden rounded-xl bg-black/5 aspect-16/10">
              <img
                src={post.imagePath}
                alt={`foto-${post.name}`}
                className="h-full w-full object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <header className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold leading-tight sm:text-xl">
                Enviado por {post.name}
              </h1>
              <p className="text-sm text-foreground/70">
                {createdAt.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                às{' '}
                {createdAt.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </header>

            <div className="rounded-xl bg-black/3 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {post.message}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-foreground/60">
                ID: <span className="font-mono">{id}</span>
              </p>

              <div className="flex gap-2">
                <DeleteButton postId={id} />
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

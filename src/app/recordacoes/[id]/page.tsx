// app/recordacoes/[id]/page.tsx
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
    <main className="min-h-dvh bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/recordacoes"
            className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm text-foreground/70 shadow-sm transition hover:bg-background hover:text-foreground hover:shadow md:active:scale-[0.99]"
          >
            <span aria-hidden="true">←</span>
            Voltar
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border bg-background/60 px-3 py-1 text-xs text-foreground/70 shadow-sm">
              Recordação
            </span>
            <span className="hidden text-xs text-foreground/50 sm:inline">
              {createdAt.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Card */}
        <article className="overflow-hidden rounded-3xl border bg-background shadow-sm">
          {post.imagePath && (
            <div className="relative overflow-hidden">
              {/* Media container */}
              <div className="relative aspect-16/10 w-full bg-black/4">
                <img
                  src={post.imagePath}
                  alt={`foto-${post.name}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* subtle top gradient for depth */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/8 via-transparent to-transparent" />
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-foreground/10" />
            </div>
          )}

          <div className="flex flex-col gap-5 p-5 sm:p-7">
            {/* Header */}
            <header className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium tracking-wide text-foreground/60">
                  Enviado por
                </p>
                <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                  {post.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/70">
                <span>
                  {createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-foreground/40">•</span>
                <span>
                  {createdAt.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </header>

            {/* Message */}
            <section className="relative overflow-hidden rounded-2xl border bg-background/60 p-4 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-foreground/[0.03] via-transparent to-transparent" />
              <p className="relative whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {post.message}
              </p>
            </section>

            {/* Footer */}
            <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <span className="rounded-md border bg-background/70 px-2 py-1 font-mono">
                  {id}
                </span>
                <span className="text-foreground/40">•</span>
                <span>ID da recordação</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <DeleteButton postId={id} />
              </div>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
}

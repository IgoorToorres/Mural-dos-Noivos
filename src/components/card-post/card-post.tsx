import { Post } from '@/types/post';
import Image from 'next/image';
import Link from 'next/link';

type CardPostProps = {
  post: Post;
};

export default function CardPost({ post }: CardPostProps) {
  return (
    <Link href={`/recordacoes/${post.id}`} className="block">
      <div className="group flex flex-col gap-3 rounded-2xl bg-accent-cream-strong p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        {post.imagePath && (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <img
              src={post.imagePath}
              alt="Foto enviada"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Enviado por: <span className="font-normal">{post.name}</span>
          </p>

          <p className="line-clamp-3 text-sm text-foreground/80">
            {post.message}
          </p>
        </div>
      </div>
    </Link>
  );
}

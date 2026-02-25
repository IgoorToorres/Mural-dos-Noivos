import { Post } from '@/types/post';
import Image from 'next/image';

type CardPostProps = {
  post: Post;
};

export default function CardPost({ post }: CardPostProps) {
  console.log(post.imagePath);
  return (
    <div className="flex flex-col gap-2 p-2 bg-accent-cream-strong rounded-2xl">
      {post.imagePath && (
        <img src={post.imagePath} width={400} height={400} alt="foto" />
      )}
      <p>Enviado por: {post.name}</p>
      <p>{post.message}</p>
    </div>
  );
}

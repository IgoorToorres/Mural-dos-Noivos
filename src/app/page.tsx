import CardPost from '@/components/card-post/card-post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getPosts } from '@/lib/posts';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <div>
        <p>Listagem das Fotos</p>
      </div>
      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <CardPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

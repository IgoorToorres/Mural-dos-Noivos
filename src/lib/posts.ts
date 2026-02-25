import { Post } from '@/types/post';
import { getBaseUrl } from './get-base-url';

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${getBaseUrl()}/api/posts`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar posts');
  }

  return res.json();
}

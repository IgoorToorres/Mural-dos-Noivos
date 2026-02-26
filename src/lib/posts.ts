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

export async function getPostById(id: string): Promise<Post> {
  const res = await fetch(`${getBaseUrl()}/api/posts/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar o post');
  }

  return res.json();
}

export async function deletePostById(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/posts/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erro ao excluir o post (${res.status}): ${body}`);
  }

  return res.json();
}

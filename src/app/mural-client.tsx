'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Post } from '@/types/post';

type MuralClientProps = {
  initialPosts: Post[];
  pollMs?: number;
};

function fingerprint(posts: Post[]) {
  if (posts.length === 0) return '0';
  const first = posts[0];
  return `${posts.length}:${first.id}:${String(first.createdAt)}`;
}

export default function MuralClient({
  initialPosts,
  pollMs = 10000,
}: MuralClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const lastFp = useRef<string>(fingerprint(initialPosts));
  const [errorCount, setErrorCount] = useState(0);

  const photos = useMemo(() => posts.filter((post) => post.imagePath), [posts]);
  const carouselItems = useMemo(() => [...photos, ...photos], [photos]);

  useEffect(() => {
    let mounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const res = await fetch('/api/posts', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const next = (await res.json()) as Post[];
        const nextFp = fingerprint(next);
        if (mounted && nextFp !== lastFp.current) {
          lastFp.current = nextFp;
          setPosts(next);
        }
        if (mounted) setErrorCount(0);
      } catch {
        if (mounted) setErrorCount((count) => Math.min(count + 1, 5));
      }
    };

    interval = setInterval(poll, pollMs);

    // backoff: if many errors, slow down the polling a bit
    if (errorCount >= 3 && interval) {
      clearInterval(interval);
      interval = setInterval(poll, pollMs * 2);
    }

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [pollMs, errorCount]);

  return (
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
  );
}

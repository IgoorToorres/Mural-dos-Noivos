export function getBaseUrl() {
  //no browser (client)
  if (typeof window !== 'undefined') return '';

  // override via env (recommended for prod)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  //em producao na vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  //local
  return 'http://localhost:3000';
}

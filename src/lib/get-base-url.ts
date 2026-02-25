export function getBaseUrl() {
  //no browser (client)
  if (typeof window !== 'undefined') return '';

  //em producao na vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  //local
  return 'http://localhost:3000';
}

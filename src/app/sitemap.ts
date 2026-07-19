import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; return ['', '/sign-in', '/sign-up'].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path ? 0.7 : 1 })); }

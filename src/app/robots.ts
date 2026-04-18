import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://velro.sa/sitemap.xml',
  };
}
// Note: Content-Signal is often added as a separate header or a raw robots.txt entry.
// Since Next.js robots.ts is restrictive, I will create a static robots.txt if needed,
// but first I'll check if I can add it to the rules.

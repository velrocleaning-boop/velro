import { MetadataRoute } from 'next';
import { locations } from '@/data/locations';
import { servicesData } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://velro.sa'; // Replace with your actual domain

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/how-it-works',
    '/faqs',
    '/why-us',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
    '/locations',
    '/contact',
    '/testimonials',
    '/blog',
    '/book',
    '/pricing',
    '/faqs',
    '/privacy-policy',
  ];

  const locationRoutes = locations.map(l => `/locations/${l.slug}`);
  const serviceDetailRoutes = servicesData.map(s => `/services/${s.slug}`);
  
  const allRoutes = [...staticRoutes, ...locationRoutes, ...serviceDetailRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}

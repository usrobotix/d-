import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://prodigitalplus.ru';
  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/uslugi`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${base}/keysy`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/faq`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/otzyvy`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/kontakty`, priority: 0.5, changeFrequency: 'yearly' as const },
  ];
  let caseSlugs: string[] = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/cases`);
    if (res.ok) {
      const cases = await res.json();
      caseSlugs = cases.map((c: { slug: string }) => c.slug);
    }
  } catch {}
  const casePages = caseSlugs.map(slug => ({
    url: `${base}/keysy/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));
  return [...staticPages, ...casePages];
}

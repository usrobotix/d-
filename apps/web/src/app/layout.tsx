import type { Metadata } from 'next';
import '../styles/site.css';
import '../styles/pages.css';
import '../styles/cases.css';
import { RevealInit } from '@/components/ui/RevealInit';

export const metadata: Metadata = {
  metadataBase: new URL('https://prodigitalplus.ru'),
  title: { default: 'Диджитал плюс — Веб, CRM, 152-ФЗ и IT-поддержка', template: '%s — Диджитал плюс' },
  description: 'ООО «Диджитал плюс» — разработка сайтов и CRM, оформление документации по 152-ФЗ, сопровождение IT-проектов. Нальчик, с 2021 года.',
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'ru_RU', siteName: 'Диджитал плюс' },
  twitter: { card: 'summary_large_image' },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'ООО «Диджитал плюс»',
  url: 'https://prodigitalplus.ru',
  telephone: '+79280104008',
  email: 'info@prodigitalplus.ru',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Чернышевского, 272',
    addressLocality: 'Нальчик',
    postalCode: '360004',
    addressCountry: 'RU',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.4846, longitude: 43.6069 },
  openingHours: 'Mo-Fr 09:00-18:00',
  priceRange: '₽₽',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body>
        {children}
        <RevealInit />
      </body>
    </html>
  );
}

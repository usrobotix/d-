import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchService, fetchServices } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const services = await fetchServices();
    return (services || []).map((s: { slug: string }) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const svc = await fetchService(params.slug);
    if (!svc) return {};
    return {
      title: `${svc.title} — Диджитал плюс`,
      description: svc.shortDesc || svc.description || '',
    };
  } catch {
    return {};
  }
}

export default async function ServicePage({ params }: Props) {
  let svc: Record<string, unknown> | null = null;
  try {
    svc = await fetchService(params.slug);
  } catch {
    notFound();
  }
  if (!svc) notFound();

  const features: string[] = Array.isArray(svc.features) ? (svc.features as string[]) : [];
  const includes: { title: string; desc: string }[] = Array.isArray(svc.includes)
    ? (svc.includes as { title: string; desc: string }[])
    : [];
  const faq: { q: string; a: string }[] = Array.isArray(svc.faq)
    ? (svc.faq as { q: string; a: string }[])
    : [];
  const price = typeof svc.price === 'string' ? svc.price : null;
  const priceNote = typeof svc.priceNote === 'string' ? svc.priceNote : null;

  return (
    <>
      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Услуги', href: '/uslugi' },
              { label: String(svc.title || '') },
            ]}
          />
          <div className="eyebrow">Услуга</div>
          <h1>{String(svc.title || '')}</h1>
          {svc.shortDesc !== undefined && svc.shortDesc !== null && <p className="lead">{String(svc.shortDesc)}</p>}
          <div className="cta-row">
            <a href="#service-form" className="btn btn-primary">
              Обсудить задачу <span className="arr">→</span>
            </a>
            <Link href="/keysy" className="btn btn-ghost">
              Примеры работ
            </Link>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {svc.description && (
        <section className="section">
          <div className="shell">
            <div className="prose reveal" style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 18, lineHeight: 1.7 }}>{String(svc.description)}</p>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES / INCLUDES */}
      {(features.length > 0 || includes.length > 0) && (
        <section className="section">
          <div className="shell">
            <div
              className="reveal"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}
            >
              {features.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Что входит</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#E2553A', flexShrink: 0, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 15 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {includes.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Включено в услугу</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {includes.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#E2553A', flexShrink: 0, marginTop: 2 }}>→</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500 }}>{item.title}</div>
                          {item.desc && <div style={{ fontSize: 13, color: 'var(--muted,#8B8B92)', marginTop: 2 }}>{item.desc}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PRICE */}
      {price && (
        <section className="section">
          <div className="shell">
            <div
              className="reveal"
              style={{
                background: 'rgba(226, 85, 58, 0.08)',
                border: '1px solid rgba(226, 85, 58, 0.2)',
                borderRadius: 16,
                padding: '32px 40px',
                maxWidth: 560,
              }}
            >
              <div style={{ fontSize: 13, color: '#8B8B92', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Стоимость
              </div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{price}</div>
              {priceNote && <p style={{ marginTop: 12, fontSize: 14, color: '#8B8B92' }}>{priceNote}</p>}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="section" id="faq">
          <div className="shell">
            <div className="section-head reveal">
              <div className="eyebrow">Вопросы и ответы</div>
              <h2>Часто спрашивают</h2>
            </div>
            <div className="faq-list reveal">
              {faq.map((item, i) => (
                <details key={i} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FORM */}
      <section className="section contact" id="service-form">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell contact-grid">
          <div className="lead-col reveal">
            <div className="eyebrow">Обсудить задачу</div>
            <h2>Готовы помочь с {String(svc.title || 'услугой').toLowerCase()}</h2>
            <p>Расскажите о своей задаче — созвонимся, разберём детали и предложим решение без обязательств.</p>
            <div className="contacts-list">
              <a href="tel:+79280104008">
                <span className="k">Телефон</span>8 928 010 40 08
              </a>
              <a href="mailto:info@prodigitalplus.ru">
                <span className="k">Почта</span>info@prodigitalplus.ru
              </a>
            </div>
          </div>
          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

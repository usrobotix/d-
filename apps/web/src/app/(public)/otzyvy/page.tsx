import type { Metadata } from 'next';
import Link from 'next/link';
import { PatternField } from '@/components/ui/PatternField';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Отзывы клиентов',
  description: 'Подтверждённые отзывы клиентов о работе компании «Диджитал плюс».',
  robots: {
    index: false,
    follow: true,
  },
};

export default function OtzyvyPage() {
  return (
    <>
      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Отзывы и благодарности' }]} />
          <h1>Отзывы <span className="accent">клиентов</span></h1>
          <p className="lead">Публикуем только подтверждённые отзывы с разрешения клиентов. Не используем вымышленные имена, компании и результаты.</p>
        </div>
      </section>

      <section className="thanks">
        <div className="shell">
          <div
            className="thanks-section"
            style={{
              maxWidth: 760,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className="eyebrow center">Раздел обновляется</div>

            <h2 style={{ marginTop: 18 }}>
              Готовим подтверждённые отзывы
            </h2>

            <p
              style={{
                marginTop: 18,
                color: 'var(--muted)',
                lineHeight: 1.7,
              }}
            >
              Сейчас собираем разрешения клиентов, полные имена,
              должности и материалы проектов. После согласования
              отзывы появятся на этой странице.
            </p>
          </div>
        </div>
      </section>

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Наш опыт</div>
          <h2>Посмотрите реализованные проекты</h2>
          <p>В кейсах показываем задачи, технические решения и результаты.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <Link href="/keysy" className="btn btn-ghost">Смотреть кейсы</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { PatternField } from '@/components/ui/PatternField';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { fetchServices } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Разработка, автоматизация и поддержка цифровых проектов',
  description: 'Поддержка чужих проектов, разработка сайтов и интернет-магазинов, CRM, интеграции, автоматизация и сопровождение персональных данных.',
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
      { '@type': 'Service', position: 1, name: 'Поддержка и развитие чужих проектов', provider: { '@type': 'Organization', name: 'ООО «Диджитал плюс»' } },
      { '@type': 'Service', position: 2, name: 'Сайты, интернет-магазины и личные кабинеты', provider: { '@type': 'Organization', name: 'ООО «Диджитал плюс»' } },
      { '@type': 'Service', position: 3, name: 'CRM, интеграции и автоматизация', provider: { '@type': 'Organization', name: 'ООО «Диджитал плюс»' } },
      { '@type': 'Service', position: 4, name: 'Персональные данные и 152-ФЗ', provider: { '@type': 'Organization', name: 'ООО «Диджитал плюс»' } },
    ],
};

export const dynamic = 'force-dynamic';
export default async function UslugiPage() {
  let apiServices: any[] = [];
  try { apiServices = await fetchServices(); } catch {}
  const services = apiServices.length > 0 ? apiServices.map((s: any) => ({
    id: s.slug,
    eyebrow: s.eyebrow,
    title: s.title,
    desc: s.description,
    forWho: s.forWho,
    includes: (s.includes ?? []).map((it: any) => ({ t: it.title, d: it.desc })),
    steps: (s.steps ?? []).map((st: any) => ({ n: st.n, t: st.title, d: st.desc })),
    tiers: (s.tiers ?? []).map((tier: any) => ({
      name: tier.name,
      price: tier.priceLabel,
      desc: tier.desc,
      items: tier.features ?? [],
      pop: tier.isPopular ?? false,
    })),
    priceNote: s.priceNote,
  })) : [];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Услуги' }]} />
            <h1>Разработка и поддержка<br/><span className="accent">цифровых проектов</span></h1>
            <p className="lead">Подключаемся к существующей системе или создаём новую. Сначала разбираемся в задаче, затем предлагаем подходящий этап работ.</p>
            <div className="svc-jump">
              <a href="#support">Поддержка проектов</a>
              <a href="#web">Сайты и магазины</a>
              <a href="#crm">CRM и автоматизация</a>
              <a href="#fz152">Персональные данные</a>
            </div>
        </div>
      </section>

        {services.length === 0 && (
          <section className="section">
            <div
              className="shell"
              style={{
                maxWidth: 760,
                textAlign: 'center',
              }}
            >
              <div className="eyebrow center">
                Временная ошибка
              </div>

              <h2 style={{ marginTop: 18 }}>
                Не удалось загрузить список услуг
              </h2>

              <p
                style={{
                  marginTop: 18,
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                }}
              >
                Можно оставить заявку или связаться с нами напрямую.
                Мы уточним задачу и предложим подходящий формат работы.
              </p>

              <div
                className="cta-row"
                style={{ justifyContent: 'center' }}
              >
                <Link
                  href="/kontakty"
                  className="btn btn-primary"
                >
                  Связаться с нами
                </Link>
              </div>
            </div>
          </section>
        )}

        {services.map((svc) => (
        <section key={svc.id} className="svc-block" id={svc.id}>
          <div className="shell grid">
            <div className="left">
              <div className="ic-lg"><Pinwheel size={34} /></div>
              <div className="eyebrow">{svc.eyebrow}</div>
              <h2>{svc.title}</h2>
              <p className="desc">{svc.desc}</p>
              <div className="for-who">
                <span className="l">Кому подойдёт</span>
                <p>{svc.forWho}</p>
              </div>
            </div>
            <div className="right">
              <div className="svc-sub">Что входит</div>
              <div className="incl">
                {svc.includes.map((it: any, i: number) => (
                  <div key={i} className="it">
                    <div className="t">{it.t}</div>
                    <div className="d">{it.d}</div>
                  </div>
                ))}
              </div>
              <div className="svc-sub">Этапы</div>
              <div className="svc-steps">
                {svc.steps.map((st: any, i: number) => (
                  <div key={i} className="st">
                    <div className="n">{st.n}</div>
                    <div><div className="t">{st.t}</div><div className="d">{st.d}</div></div>
                  </div>
                ))}
              </div>
              <div className="svc-sub">Пакеты</div>
              <div className="tiers">
                {svc.tiers.map((tier: any, i: number) => (
                  <div key={i} className={`tier${tier.pop ? ' pop' : ''}`}>
                    <div className="tn">{tier.name}</div>
                    <div className="tp">{tier.price}</div>
                    <div className="td">{tier.desc}</div>
                    <ul>{tier.items.map((li: any, li_i: number) => <li key={li_i}>{li}</li>)}</ul>
                    <Link href="/kontakty" className={`btn ${tier.pop ? 'btn-primary' : 'btn-ghost'}`}>Обсудить</Link>
                  </div>
                ))}
              </div>
              <div className="price-note">{svc.priceNote}</div>
            </div>
          </div>
        </section>
      ))}

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Не уверены, что нужно?</div>
          <h2>Разберём задачу и подскажем</h2>
          <p>Опишите текущую ситуацию, ограничения и желаемый результат. Предложим диагностику, отдельный этап работ или полноценный проект.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <Link href="/keysy" className="btn btn-ghost">Смотреть кейсы</Link>
          </div>
        </div>
      </section>
    </>
  );
}

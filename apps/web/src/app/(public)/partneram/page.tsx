import type { Metadata } from 'next';
import Link from 'next/link';
import { PatternField } from '@/components/ui/PatternField';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Партнёрская программа — Диджитал плюс',
  description: 'Сотрудничество с консультантами, агентствами и интеграторами. Приводите клиентов — получайте вознаграждение с каждого успешного проекта.',
};

const PARTNER_TYPES = [
  {
    icon: '🤝',
    title: 'Бизнес-консультанты',
    desc: 'Вы помогаете компаниям выстраивать процессы. Мы реализуем цифровую часть: CRM, порталы, интеграции.',
  },
  {
    icon: '📋',
    title: 'Юридические фирмы',
    desc: 'Ваши клиенты часто нуждаются в цифровых инструментах: сайт, личный кабинет, 152-ФЗ. Мы берём это на себя.',
  },
  {
    icon: '🏥',
    title: 'Медицинские консультанты',
    desc: 'Клиники и центры, с которыми вы работаете, нуждаются в современных системах. Рекомендуйте нас.',
  },
  {
    icon: '🖥',
    title: '1С-партнёры и интеграторы',
    desc: 'Вы занимаетесь 1С, мы — веб-стороной и CRM. Совместные проекты без конкуренции.',
  },
];

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Рекомендуете нас клиенту',
    desc: 'Когда у вашего клиента появляется задача по разработке, поддержке или автоматизации — рекомендуете нас.',
  },
  {
    n: '02',
    title: 'Мы проводим консультацию',
    desc: 'Встречаемся с клиентом, разбираем задачу и готовим предложение. Вы остаётесь в копии — прозрачно.',
  },
  {
    n: '03',
    title: 'Заключаем договор',
    desc: 'Клиент подписывает договор с нами. В договоре фиксируется источник привлечения.',
  },
  {
    n: '04',
    title: 'Вы получаете вознаграждение',
    desc: 'После оплаты первого этапа клиентом — начисляем партнёрское вознаграждение.',
  },
];

const CONDITIONS = [
  { label: 'Вознаграждение', value: '10% от суммы каждого проекта' },
  { label: 'Порог выплаты', value: 'От 10 000 ₽ накопленных' },
  { label: 'Способ выплаты', value: 'На расчётный счёт (ИП или ООО) или самозанятость' },
  { label: 'Договор', value: 'Агентский договор или договор о сотрудничестве' },
  { label: 'Срок начисления', value: 'В течение 5 рабочих дней после оплаты клиентом' },
  { label: 'Отчётность', value: 'Ежемесячный отчёт по приведённым клиентам' },
];

export default function PartneramPage() {
  return (
    <>
      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Партнёрам' }]} />
          <div className="eyebrow">Партнёрская программа</div>
          <h1>Рекомендуйте нас —<br/><span className="accent">зарабатывайте вместе</span></h1>
          <p className="lead">Если среди ваших клиентов или знакомых есть те, кому нужна разработка, автоматизация или поддержка цифровых проектов — рекомендуйте нас и получайте вознаграждение с каждого успешного проекта.</p>
          <div className="cta-row">
            <a href="#partner-form" className="btn btn-primary">Стать партнёром <span className="arr">→</span></a>
            <Link href="/uslugi" className="btn btn-ghost">Наши услуги</Link>
          </div>
        </div>
      </section>

      {/* PARTNER TYPES */}
      <section className="section" id="for-whom">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Для кого</div>
            <h2>Партнёрство без конкуренции</h2>
            <p>Работаем с теми, у кого нет своей команды разработки, но есть клиенты с цифровыми задачами.</p>
          </div>
          <div className="services-grid reveal">
            {PARTNER_TYPES.map((p, i) => (
              <article key={i} className="svc">
                <span className="num" style={{ fontSize: 28 }}>{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Как работает</div>
            <h2>Четыре шага к партнёрскому вознаграждению</h2>
          </div>
          <div className="process-grid reveal">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} className="step">
                <div className="dot">{step.n}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="section" id="conditions">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Условия</div>
            <h2>Прозрачные условия без мелкого шрифта</h2>
          </div>
          <div className="reveal" style={{ maxWidth: 680 }}>
            {CONDITIONS.map((c, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: 16,
                padding: '16px 0',
                borderBottom: i < CONDITIONS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ color: 'var(--muted, #8B8B92)', fontSize: 14 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="section contact" id="partner-form">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell contact-grid">
          <div className="lead-col reveal">
            <div className="eyebrow">Заявка</div>
            <h2>Хотите стать партнёром?</h2>
            <p>Оставьте контакт — обсудим формат сотрудничества и подпишем соглашение. Обычно отвечаем в течение рабочего дня.</p>
            <div className="contacts-list">
              <a href="tel:+79280104008"><span className="k">Телефон</span>8 928 010 40 08</a>
              <a href="mailto:info@prodigitalplus.ru"><span className="k">Почта</span>info@prodigitalplus.ru</a>
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

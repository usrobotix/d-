import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCases, fetchFaq } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { Accordion } from '@/components/ui/Accordion';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Диджитал плюс — Веб, CRM, 152-ФЗ и IT-поддержка',
  description: 'ООО «Диджитал плюс» — разработка сайтов и CRM, оформление документации по 152-ФЗ, сопровождение IT-проектов. Нальчик, с 2021 года.',
};

const FALLBACK_CASES = [
  {
    id: 1, title: 'Портал и CRM для торговой сети', direction: 'crm',
    tags: ['Веб', 'CRM'], desc: 'Объединили сайт, складской учёт и продажи в единую систему. Автоматизировали обработку заказов.',
    metrics: [{ mv: '−40<span class="accent">%</span>', mk: 'времени на заказ' }, { mv: '2.5<span class="accent">×</span>', mk: 'рост конверсии' }],
    big: true,
  },
  {
    id: 2, title: 'Аудит и пакет 152-ФЗ для клиники', direction: 'fz152',
    tags: ['152-ФЗ'], desc: 'Полный комплект документов и подготовка к проверке РКН.',
    metrics: [{ mv: '0', mk: 'замечаний РКН' }],
    big: false,
  },
  {
    id: 3, title: 'Сопровождение SaaS-платформы', direction: 'support',
    tags: ['Поддержка'], desc: 'Мониторинг 24/7, релизы и развитие функционала по SLA.',
    metrics: [{ mv: '99.9<span class="accent">%</span>', mk: 'аптайм' }],
    big: false,
  },
  {
    id: 4, title: 'Корпоративный сайт строительной компании', direction: 'web',
    tags: ['Веб'], desc: 'Новый сайт с каталогом объектов и интеграцией с 1С. Рост заявок из органики.',
    metrics: [{ mv: '+180<span class="accent">%</span>', mk: 'заявок из поиска' }, { mv: '1.2<span class="accent">с</span>', mk: 'загрузка страницы' }],
    big: true,
  },
];

const FALLBACK_FAQ = [
  { id: 1, question: 'Сколько стоит разработка сайта или CRM?', answer: 'Стоимость зависит от задач и объёма. После короткого брифа и анализа мы готовим смету с фиксированными этапами и сроками — без скрытых доплат. Первичная консультация бесплатна.' },
  { id: 2, question: 'Сколько времени занимает проект?', answer: 'Лендинг — от 2 недель, корпоративный сайт — от 4–6 недель, внедрение CRM — от 3 недель. Точные сроки фиксируем в договоре после этапа анализа.' },
  { id: 3, question: 'Что входит в пакет по 152-ФЗ?', answer: 'Аудит обработки персональных данных, комплект политик и согласий, доработка сайта (баннеры, формы), подготовка и подача уведомления в РКН, инструкции для сотрудников и подготовка к проверкам.' },
  { id: 4, question: 'Вы работаете с клиентами из других городов?', answer: 'Да. Мы находимся в Нальчике, но работаем со всей Россией удалённо — встречи онлайн, документы по ЭДО, прозрачная отчётность по проекту.' },
  { id: 5, question: 'Можно отдать на поддержку проект, который делали не вы?', answer: 'Можно. Проводим технический аудит, фиксируем текущее состояние и берём проект на сопровождение по согласованному SLA с мониторингом и резервным копированием.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FALLBACK_FAQ.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

export default async function HomePage() {
  const [casesData, faqData] = await Promise.all([fetchCases(), fetchFaq()]);
  const cases = casesData.length > 0 ? casesData.slice(0, 4) : FALLBACK_CASES;
  const faqItems = faqData.length > 0 ? faqData.slice(0, 5) : FALLBACK_FAQ;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell hero-inner">
          <div className="eyebrow">Веб · CRM · 152-ФЗ · Поддержка</div>
          <h1>Цифровые продукты,<br/>которые <span className="accent">работают</span><br/>на ваш бизнес.</h1>
          <p className="lead">Разрабатываем сайты и CRM, приводим документы в соответствие 152-ФЗ и сопровождаем IT-проекты. Пятый год собираем системы, которые не разваливаются после сдачи.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <Link href="/keysy" className="btn btn-ghost">Смотреть кейсы</Link>
          </div>
          <div className="hero-meta">
            <div className="m"><div className="v">5 <span className="accent">лет</span></div><div className="k">на рынке</div></div>
            <div className="m"><div className="v">120<span className="accent">+</span></div><div className="k">проектов</div></div>
            <div className="m"><div className="v">40<span className="accent">+</span></div><div className="k">клиентов на поддержке</div></div>
            <div className="m"><div className="v">99.9<span className="accent">%</span></div><div className="k">аптайм проектов</div></div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="shell row">
          <div className="lab">Нам доверяют</div>
          <div className="clients">
            <span className="c">Альфа-Ритейл</span>
            <span className="c">МедЦентр+</span>
            <span className="c">ЛогистПро</span>
            <span className="c">ЭкоСтрой</span>
            <span className="c">ФинГрупп</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Услуги</div>
            <h2>Четыре направления — один подрядчик на весь цикл</h2>
            <p>От первой строчки кода до сопровождения в проде. Не нужно собирать команду из разрозненных фрилансеров.</p>
          </div>
          <div className="services-grid">
            {[
              { num: '01', title: 'Разработка сайтов', desc: 'Корпоративные сайты, лендинги, интернет-магазины и порталы. Быстрые, адаптивные, готовые к нагрузке и SEO.', items: ['Дизайн и вёрстка под ключ', 'Интеграции с 1С, оплатами, CRM', 'Производительность и SEO-база'], href: '/uslugi#web' },
              { num: '02', title: 'Разработка CRM', desc: 'Внедряем и дорабатываем CRM под реальные процессы продаж и сервиса. Автоматизируем рутину и отчётность.', items: ['Настройка воронок и автоматизаций', 'Кастомные модули и интеграции', 'Миграция данных без потерь'], href: '/uslugi#crm' },
              { num: '03', title: 'Документация 152-ФЗ', desc: 'Приводим обработку персональных данных в соответствие закону. Полный пакет документов и уведомление РКН.', items: ['Политики и согласия на обработку', 'Аудит сайта и процессов', 'Подготовка к проверкам'], href: '/uslugi#fz152' },
              { num: '04', title: 'Поддержка IT-проектов', desc: 'Берём на сопровождение сайты, CRM и инфраструктуру. SLA, мониторинг, обновления и развитие по плану.', items: ['Реакция по SLA, дежурная линия', 'Мониторинг и резервные копии', 'Доработки и развитие'], href: '/uslugi#support' },
            ].map((svc) => (
              <article key={svc.num} className="svc reveal">
                <span className="num">{svc.num}</span>
                <div className="ic"><Pinwheel size={28} /></div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <ul>{svc.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
                <Link href={svc.href} className="more">Подробнее <span className="arr">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="section numbers" id="numbers">
        <PatternField psize={24} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">О компании</div>
            <h2>Пять лет, измеримых в цифрах</h2>
            <p>«Диджитал плюс» — команда из Нальчика, которая строит цифровые продукты для бизнеса по всей России.</p>
          </div>
          <div className="num-grid reveal">
            <div className="num-cell"><div className="v">2021</div><div className="k">год основания</div><div className="d">Пятый год на рынке цифровой разработки.</div></div>
            <div className="num-cell"><div className="v">120<span className="accent">+</span></div><div className="k">проектов</div><div className="d">Сайты, CRM и комплексные системы.</div></div>
            <div className="num-cell"><div className="v">40<span className="accent">+</span></div><div className="k">на поддержке</div><div className="d">Клиентов на постоянном сопровождении.</div></div>
            <div className="num-cell"><div className="v">8</div><div className="k">специалистов</div><div className="d">Разработка, дизайн, юристы по 152-ФЗ.</div></div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Как мы работаем</div>
            <h2>Прозрачный процесс из пяти шагов</h2>
            <p>Вы всегда понимаете, на каком этапе проект и что будет дальше.</p>
          </div>
          <div className="process-grid reveal">
            <div className="step"><div className="dot">01</div><h4>Заявка</h4><p>Обсуждаем задачу, цели и бюджет. Бесплатная консультация.</p></div>
            <div className="step"><div className="dot">02</div><h4>Анализ</h4><p>Изучаем процессы, готовим ТЗ и смету с фиксированными сроками.</p></div>
            <div className="step is-accent"><div className="dot">03</div><h4>Разработка</h4><p>Дизайн, код, демо по спринтам. Показываем прогресс еженедельно.</p></div>
            <div className="step"><div className="dot">04</div><h4>Запуск</h4><p>Тестирование, перенос на прод, обучение вашей команды.</p></div>
            <div className="step"><div className="dot">05</div><h4>Поддержка</h4><p>Сопровождаем, мониторим и развиваем продукт по SLA.</p></div>
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="section divider" id="cases">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Кейсы</div>
            <h2>Проекты, которые принесли результат</h2>
            <p>12 проектов в портфолио — сайты, CRM, мобильные приложения, интеграции и 152-ФЗ. Ниже несколько примеров.</p>
          </div>
          <div className="cases-grid">
            {(cases as typeof FALLBACK_CASES).map((c) => {
              const isBig = (c as typeof FALLBACK_CASES[0]).big;
              const tags = (c as typeof FALLBACK_CASES[0]).tags ?? [];
              const metrics = (c as typeof FALLBACK_CASES[0]).metrics ?? [];
              return (
                <article key={c.id} className={`case ${isBig ? 'big' : 'small'} reveal`}>
                  <div className="thumb">
                    <PatternField psize={isBig ? 22 : 20} pgap={isBig ? 26 : 24} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
                    <span className="tag">{tags.join(' · ')}</span>
                    {isBig && (
                      <div className="big-mark">
                        <Pinwheel size={180} color="rgba(244,241,235,0.12)" accent="rgba(226,85,58,0.12)" />
                      </div>
                    )}
                  </div>
                  <div className="body">
                    <h3>{c.title}</h3>
                    <p>{(c as typeof FALLBACK_CASES[0]).desc}</p>
                    <div className="metrics">
                      {metrics.map((m, mi) => (
                        <div key={mi} className="m">
                          <div className="mv" dangerouslySetInnerHTML={{ __html: m.mv }} />
                          <div className="mk">{m.mk}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/keysy" className="btn btn-ghost">Все кейсы <span className="arr">→</span></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="shell">
          <div className="section-head center reveal">
            <div className="eyebrow center">Отзывы</div>
            <h2>Что говорят клиенты</h2>
          </div>
          <div className="tst-grid">
            {[
              { q: 'Сделали CRM ровно под наши процессы, а не наоборот. Спустя год — стабильно работает и развивается.', name: 'Артур Б.', role: 'Дир. торговой сети', initial: 'А' },
              { q: 'По 152-ФЗ закрыли вопрос полностью: документы, сайт, уведомление. Проверку прошли без единого замечания.', name: 'Марина К.', role: 'Управляющая клиники', initial: 'М' },
              { q: 'Главное — отвечают и чинят быстро. На поддержке у них спим спокойно, мониторинг ловит всё раньше нас.', name: 'Денис Р.', role: 'CTO, SaaS-платформа', initial: 'Д' },
            ].map((t, i) => (
              <div key={i} className="tst reveal">
                <p className="quote">{t.q}</p>
                <div className="who">
                  <div className="ava">{t.initial}</div>
                  <div><div className="nm">{t.name}</div><div className="rl">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section divider" id="faq">
        <div className="shell">
          <div className="section-head center reveal">
            <div className="eyebrow center">FAQ</div>
            <h2>Частые вопросы</h2>
          </div>
          <div className="faq reveal">
            {faqItems.map((f: { id?: number; question: string; answer: string }, i: number) => (
              <Accordion key={f.id ?? i} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell contact-grid">
          <div className="lead-col reveal">
            <div className="eyebrow">Заявка</div>
            <h2>Обсудим ваш проект</h2>
            <p>Оставьте заявку — ответим в течение рабочего дня, зададим уточняющие вопросы и предложим план. Без обязательств.</p>
            <div className="contacts-list">
              <a href="tel:+79280104008"><span className="k">Телефон</span>8 928 010 40 08</a>
              <a href="mailto:info@prodigitalplus.ru"><span className="k">Почта</span>info@prodigitalplus.ru</a>
              <div className="ci"><span className="k">Адрес</span>г. Нальчик, ул. Чернышевского, 272</div>
              <div className="ci"><span className="k">Часы</span>Пн–Пт · 9:00–18:00</div>
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

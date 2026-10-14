import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCases, fetchFaq } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { Accordion } from '@/components/ui/Accordion';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Разработка, доработка и поддержка сайтов и CRM — Диджитал плюс',
  description: 'Разрабатываем и сопровождаем сайты, интернет-магазины, CRM, личные кабинеты и интеграции. Принимаем проекты после других подрядчиков. Работаем по всей России.',
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
  const cases = casesData.length > 0
    ? casesData.slice(0, 4).map((item: any, index: number) => ({
        ...item,
        desc: item.sub || item.taskText || '',
        metrics: Array.isArray(item.resultMetrics) ? item.resultMetrics : [],
        big: index === 0 || index === 3,
      }))
    : FALLBACK_CASES;
  const flatFaq = faqData.flatMap((cat: { items?: { id: number; question: string; answer: string }[] }) => cat.items || []);
  const faqItems = flatFaq.length > 0 ? flatFaq.slice(0, 5) : FALLBACK_FAQ;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell hero-inner">
          <div className="eyebrow">Разработка · Доработка · Автоматизация · Поддержка</div>
          <h1>Сайты и цифровые системы,<br/>за которые <span className="accent">есть кому отвечать.</span></h1>
          <p className="lead">Разрабатываем, дорабатываем и сопровождаем сайты, интернет-магазины, CRM, личные кабинеты и интеграции. Принимаем проекты после других подрядчиков и помогаем бизнесу автоматизировать ручные процессы.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить задачу <span className="arr">→</span></Link>
            <Link href="/uslugi#support" className="btn btn-ghost">Передать проект на поддержку</Link>
          </div>
          <div className="hero-meta">
            <div className="m"><div className="v">с <span className="accent">2014</span></div><div className="k">команда в разработке</div></div>
            <div className="m"><div className="v">15 000<span className="accent">+</span></div><div className="k">выполненных задач</div></div>
            <div className="m"><div className="v">10</div><div className="k">проектов на поддержке</div></div>
            <div className="m"><div className="v">вся <span className="accent">РФ</span></div><div className="k">работаем удалённо</div></div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="shell row">
          <div className="lab">Некоторые проекты</div>
          <div className="clients">
            <span className="c">MG Ceramic</span>
            <span className="c">Международный юридический клуб</span>
            <span className="c">Liumi</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Услуги</div>
            <h2>От диагностики и плана до запуска и поддержки</h2>
            <p>Подключаемся к существующим проектам или разрабатываем новые. Не предлагаем переделывать систему с нуля, если задачу можно решить доработкой.</p>
          </div>

          <div className="services-grid">
            {[
              {
                num: '01',
                title: 'Поддержка чужих проектов',
                desc: 'Принимаем сайты, магазины, CRM и личные кабинеты после других разработчиков. Восстанавливаем контроль и организуем дальнейшее развитие.',
                items: [
                  'Техническая диагностика проекта',
                  'Доступы, резервные копии и документация',
                  'Исправления и регулярные доработки'
                ],
                href: '/uslugi#support'
              },
              {
                num: '02',
                title: 'Сайты и интернет-магазины',
                desc: 'Разрабатываем корпоративные сайты, каталоги, интернет-магазины, порталы и личные кабинеты под реальные процессы бизнеса.',
                items: [
                  'Аналитика, прототипирование и дизайн',
                  'Frontend, backend и административная часть',
                  'SEO-база, аналитика и запуск'
                ],
                href: '/uslugi#web'
              },
              {
                num: '03',
                title: 'CRM, интеграции и автоматизация',
                desc: 'Объединяем сайт, CRM и внешние сервисы. Автоматизируем передачу заявок, обработку данных, отчётность и рутинные операции.',
                items: [
                  'CRM и внутренние системы',
                  'API и обмен данными',
                  'Автоматизация с применением ИИ'
                ],
                href: '/uslugi#crm'
              },
              {
                num: '04',
                title: 'Персональные данные и 152-ФЗ',
                desc: 'Совместно с профильным специалистом проверяем сайт и процессы обработки данных, готовим документы и внедряем необходимые технические изменения.',
                items: [
                  'Аудит сайта и процессов',
                  'Политики и согласия',
                  'Доработка форм и пользовательских сценариев'
                ],
                href: '/uslugi#fz152'
              }
            ].map((svc) => (
              <article key={svc.num} className="svc reveal">
                <span className="num">{svc.num}</span>
                <div className="ic"><Pinwheel size={28} /></div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <ul>{svc.items.map((item, index) => <li key={index}>{item}</li>)}</ul>
                <Link href={svc.href} className="more">
                  Подробнее <span className="arr">→</span>
                </Link>
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
            <h2>Опыт с 2014 года — в конкретных цифрах</h2>
            <p>«Диджитал плюс» — компактная команда с личным участием основателей. Компания зарегистрирована в Нальчике, работаем с бизнесом по всей России.</p>
          </div>
          <div className="num-grid reveal">
            <div className="num-cell">
              <div className="v">2014</div>
              <div className="k">начало работы команды</div>
              <div className="d">Практический опыт в разработке, доработке и сопровождении цифровых проектов.</div>
            </div>
            <div className="num-cell">
              <div className="v">15 000<span className="accent">+</span></div>
              <div className="k">выполненных задач</div>
              <div className="d">Разработка, вёрстка, наполнение, интеграции, исправления и техническая поддержка.</div>
            </div>
            <div className="num-cell">
              <div className="v">10</div>
              <div className="k">проектов на поддержке</div>
              <div className="d">Регулярные доработки, контроль работоспособности и дальнейшее развитие.</div>
            </div>
            <div className="num-cell">
              <div className="v">2021</div>
              <div className="k">регистрация ООО</div>
              <div className="d">Работаем официально, заключаем договоры и принимаем проекты из любых регионов России.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Как мы работаем</div>
            <h2>Сначала разбираемся в задаче — затем предлагаем решение</h2>
            <p>Каждый этап имеет понятный результат. Вы знаете, что происходит с проектом и за что платите.</p>
          </div>

          <div className="process-grid reveal">
            <div className="step">
              <div className="dot">01</div>
              <h4>Диагностика</h4>
              <p>Изучаем задачу, текущий проект, ограничения, доступы и риски.</p>
            </div>

            <div className="step">
              <div className="dot">02</div>
              <h4>План</h4>
              <p>Разделяем критические работы, обязательные исправления и дальнейшее развитие.</p>
            </div>

            <div className="step is-accent">
              <div className="dot">03</div>
              <h4>Реализация</h4>
              <p>Работаем последовательными этапами и показываем промежуточный результат.</p>
            </div>

            <div className="step">
              <div className="dot">04</div>
              <h4>Проверка и запуск</h4>
              <p>Тестируем, переносим изменения и контролируем работу основных сценариев.</p>
            </div>

            <div className="step">
              <div className="dot">05</div>
              <h4>Развитие</h4>
              <p>Поддерживаем проект, исправляем проблемы и планируем следующие улучшения.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="section divider" id="cases">
        <div className="shell">
          <div className="section-head reveal">
            <div className="eyebrow">Кейсы</div>
            <h2>Проекты, которые принесли результат</h2>
            <p>Сайты, интернет-магазины, CRM, личные кабинеты, интеграции и внутренние системы. Ниже несколько примеров.</p>
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

      {/* ADVANTAGES */}
      <section className="section" id="advantages">
        <div className="shell">
          <div className="section-head center reveal">
            <div className="eyebrow center">Наш подход</div>
            <h2>Почему с нами удобно работать</h2>
          </div>

          <div className="tst-grid">
            <div className="tst reveal">
              <p className="quote">Основатели лично участвуют в аналитике, разработке и контроле качества. Проект не передаётся между случайными исполнителями.</p>
              <div className="who">
                <div className="ava">01</div>
                <div>
                  <div className="nm">Личное участие</div>
                  <div className="rl">Сохраняем контекст проекта</div>
                </div>
              </div>
            </div>

            <div className="tst reveal">
              <p className="quote">Можем разобраться в существующем коде, восстановить доступы, найти критические проблемы и продолжить развитие после другого подрядчика.</p>
              <div className="who">
                <div className="ava">02</div>
                <div>
                  <div className="nm">Работаем с чужими проектами</div>
                  <div className="rl">Не навязываем разработку с нуля</div>
                </div>
              </div>
            </div>

            <div className="tst reveal">
              <p className="quote">Используем ИИ и автоматизацию для ускорения рутинных операций, но результат проверяется специалистом, а ответственность остаётся на нас.</p>
              <div className="who">
                <div className="ava">03</div>
                <div>
                  <div className="nm">ИИ под контролем человека</div>
                  <div className="rl">Скорость без потери ответственности</div>
                </div>
              </div>
            </div>
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
            <h2>Расскажите, что сейчас не работает</h2>
            <p>Обычно отвечаем в течение часа в рабочее время. Если потребуется изучить сайт или описание задачи, вернёмся с содержательным ответом в течение рабочего дня.</p>
            <div className="contacts-list">
              <a href="tel:+79280104008"><span className="k">Телефон</span>8 928 010 40 08</a>
              <a href="mailto:info@prodigitalplus.ru"><span className="k">Почта</span>info@prodigitalplus.ru</a>
              <div className="ci"><span className="k">Адрес</span>г. Нальчик, просп. Шогенцукова, 22</div>
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

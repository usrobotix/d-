import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCase, fetchCases } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const FALLBACK_CASES: Record<string, {
  slug: string; title: string; sub: string; tags: string[];
  client: string; direction: string; year: string; term: string; stack: string[];
  task: string; taskExtra?: string;
  solution: string[];
  results: Array<{ mv: string; mk: string }>;
  closing: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
  ctaTitle: string; ctaDesc: string;
}> = {
  'mg-ceramic': {
    slug: 'mg-ceramic',
    title: 'mg-ceramic.ru — сайт производителя керамики с каталогом и заявками',
    sub: 'Превратили переписку в мессенджерах в управляемый поток онлайн-заявок: витрина продукции, наличие из 1С и формы для опта и розницы.',
    tags: ['Сайт', 'Каталог', '1С'],
    client: 'MG-Ceramic, производитель керамики',
    direction: 'Разработка сайта',
    year: '2023',
    term: '≈ 6 недель',
    stack: ['React', '1С', 'REST API', 'SEO'],
    task: 'У завода была качественная продукция, но не было современной витрины. Заявки приходили хаотично — через мессенджеры и звонки, без единой системы. Опт и розница путались, менеджеры вручную сверяли наличие.',
    taskExtra: 'Нужен был сайт, который представит каталог, разведёт опт и розницу по разным сценариям и подтянет актуальные остатки из 1С.',
    solution: [
      'Спроектировали структуру каталога с фильтрами по коллекциям, форматам и характеристикам',
      'Сделали карточки товаров с характеристиками, фото и актуальным наличием',
      'Развели сценарии опт/розница с разными формами заявок',
      'Подключили обмен с 1С: остатки и цены обновляются автоматически',
      'Заложили SEO-базу: структура, мета-теги, скорость загрузки',
    ],
    results: [
      { mv: 'Онлайн', mk: 'единый поток заявок' },
      { mv: '1С', mk: 'остатки в реальном времени' },
      { mv: 'Опт + розница', mk: 'разведены по сценариям' },
    ],
    closing: 'Сайт стал точкой входа для клиентов: заявки собираются в одном месте, менеджеры не тратят время на сверку наличия, а каталог работает на продвижение в поиске.',
    prev: { slug: '1c-sync', title: 'Синхронизация 1С ↔ Яндекс ↔ сайты' },
    next: { slug: 'crm-realty', title: 'CRM для агентства недвижимости' },
    ctaTitle: 'Сделаем сайт, который приносит заявки',
    ctaDesc: 'Расскажите о продукте — предложим структуру, интеграции и смету.',
  },
  'crm-realty': {
    slug: 'crm-realty',
    title: 'CRM для агентства недвижимости с картой объектов',
    sub: 'Заменили разрозненные таблицы и папки единой системой с картой объектов, карточками сделок и ролями для каждого агента.',
    tags: ['CRM', 'Карта', 'Недвижимость'],
    client: 'Агентство недвижимости',
    direction: 'Разработка CRM',
    year: '2024',
    term: '≈ 10 недель',
    stack: ['React', 'Map API', 'PostgreSQL', 'Node'],
    task: 'Агентству нужна была единая база объектов с отображением на карте и удобными карточками вместо разрозненных таблиц и папок с фото.',
    solution: [
      'Карта объектов с кластеризацией и фильтрами по параметрам',
      'Карточки с фото, статусами и полной историей',
      'Воронки сделок и распределение по агентам',
      'Разграничение доступа по ролям',
    ],
    results: [
      { mv: '1 база', mk: 'вместо таблиц' },
      { mv: 'Карта', mk: 'всех объектов' },
      { mv: 'Роли', mk: 'доступ по агентам' },
    ],
    closing: 'Теперь агенты работают в единой системе — видят все объекты на карте, ведут сделки в CRM и не теряют историю взаимодействия с клиентами.',
    prev: { slug: 'mg-ceramic', title: 'mg-ceramic.ru — сайт производителя керамики' },
    next: { slug: 'kurort', title: 'Сайт для АО «Курорт Нальчик»' },
    ctaTitle: 'Нужна CRM для вашего бизнеса?',
    ctaDesc: 'Разберём процессы и предложим оптимальное решение — готовую платформу или разработку с нуля.',
  },
  'kurort': {
    slug: 'kurort',
    title: 'Сайт для АО «Курорт Нальчик»',
    sub: 'Официальная витрина курорта: услуги, инфраструктура, новости и приём заявок онлайн.',
    tags: ['Сайт', 'Гос / АО'],
    client: 'АО «Курорт Нальчик»',
    direction: 'Разработка сайта',
    year: '2024',
    term: '≈ 8 недель',
    stack: ['React', 'CMS', 'SEO'],
    task: 'Официальный сайт курорта требовал обновления: нужны были разделы услуг и объектов, новости, документы и современные формы заявок.',
    solution: [
      'Структура разделов услуг и объектов курорта',
      'Раздел новостей и документов с CMS',
      'Формы заявок и обратной связи',
      'SEO-оптимизация и адаптив',
    ],
    results: [
      { mv: 'Витрина', mk: 'всех услуг курорта' },
      { mv: 'Заявки', mk: 'онлайн' },
      { mv: 'Адаптив', mk: 'моб. трафик' },
    ],
    closing: 'Сайт представляет полную инфраструктуру курорта и собирает заявки на отдых и лечение из органического поиска.',
    prev: { slug: 'crm-realty', title: 'CRM для агентства недвижимости' },
    next: { slug: '1c-sync', title: 'Синхронизация 1С ↔ Яндекс ↔ сайты' },
    ctaTitle: 'Нужен корпоративный сайт?',
    ctaDesc: 'Расскажите о компании — предложим структуру и смету.',
  },
  '1c-sync': {
    slug: '1c-sync',
    title: 'Синхронизация 1С ↔ Яндекс.Товары ↔ сайты',
    sub: 'Автоматизировали ручную выгрузку товаров: цены, остатки и описания обновляются сами на всех площадках.',
    tags: ['Интеграция', '1С'],
    client: 'MG-Ceramic',
    direction: 'Интеграция',
    year: '2024',
    term: '≈ 4 недели',
    stack: ['1С', 'Яндекс API', 'ETL', 'Cron'],
    task: 'После запуска сайта и каталога встала задача убрать ручную выгрузку: менеджеры тратили несколько часов в день на обновление цен и остатков на разных площадках.',
    solution: [
      'Интеграционный слой с маппингом полей между системами',
      'Расписание выгрузок по cron с обработкой ошибок',
      'Логи изменений и контроль расхождений',
      'Уведомления при критических ошибках',
    ],
    results: [
      { mv: '−100%', mk: 'ручного труда' },
      { mv: 'Авто', mk: 'цены и остатки' },
      { mv: '0', mk: 'рассинхрона площадок' },
    ],
    closing: 'После запуска интеграции менеджеры перестали тратить время на ручные выгрузки — данные актуальны на сайте и в Яндексе автоматически.',
    prev: { slug: 'kurort', title: 'Сайт для АО «Курорт Нальчик»' },
    next: { slug: 'mg-ceramic', title: 'mg-ceramic.ru — сайт производителя керамики' },
    ctaTitle: 'Нужна интеграция с 1С?',
    ctaDesc: 'Расскажите о вашей задаче — настроим синхронизацию данных.',
  },
};

export async function generateStaticParams() {
  try {
    const cases = await fetchCases();
    if (cases.length > 0) {
      return cases.map((c: { slug: string }) => ({ slug: c.slug }));
    }
  } catch {}
  return Object.keys(FALLBACK_CASES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caseData = await fetchCase(params.slug);
  const fallback = FALLBACK_CASES[params.slug];
  const title = caseData?.seoTitle ?? caseData?.title ?? fallback?.title ?? 'Кейс';
  const desc = caseData?.seoDesc ?? fallback?.sub ?? 'Кейс компании Диджитал плюс';
  return {
    title,
    description: desc,
    alternates: { canonical: `https://prodigitalplus.ru/keysy/${params.slug}` },
  };
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // already an embed url
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  // youtube.com/watch?v=ID
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  // direct video file — return as-is for <video> tag
  return url;
}

export default async function CasePage({ params }: { params: { slug: string } }) {
  const apiCase = await fetchCase(params.slug);

  const directionLabels: Record<string, string> = {
    web: 'Веб-разработка',
    crm: 'CRM и автоматизация',
    integration: 'Интеграция',
    mobile: 'Мобильная разработка',
    fz152: 'Персональные данные и 152-ФЗ',
    support: 'Техническая поддержка',
  };

  const normalized = apiCase ? {
    ...apiCase,
    title: apiCase.h1 || apiCase.title,
    direction: directionLabels[apiCase.direction] || apiCase.direction,
    task: apiCase.taskText,
    taskExtra: undefined,
    solution: Array.isArray(apiCase.solutionItems) ? apiCase.solutionItems : [],
    results: Array.isArray(apiCase.resultMetrics) ? apiCase.resultMetrics : [],
    closing: apiCase.closingText,
    videoUrl: apiCase.videoUrl || null,
    testimonialText: apiCase.testimonialText || null,
    testimonialImage: apiCase.testimonialImage || null,
    gallery: Array.isArray(apiCase.gallery) ? apiCase.gallery : [],
    ctaTitle: 'Разберём вашу задачу и предложим следующий шаг',
    ctaDesc: 'Изучим текущий проект, ограничения и желаемый результат. Предложим аудит, отдельный этап работ или полноценную разработку.',
  } : null;
  const c = normalized ?? FALLBACK_CASES[params.slug];

  if (!c) {
    return (
      <div className="shell" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <h1>Кейс не найден</h1>
        <Link href="/keysy" className="btn btn-ghost" style={{ marginTop: 24 }}>← Все кейсы</Link>
      </div>
    );
  }

  const caseData = c as typeof FALLBACK_CASES['mg-ceramic'] & {
    cover?: string;
    videoUrl?: string | null;
    testimonialText?: string | null;
    testimonialImage?: string | null;
    gallery?: string[];
  };

  const videoEmbed = caseData.videoUrl ? getYoutubeEmbedUrl(caseData.videoUrl) : null;
  const isYoutube = videoEmbed && videoEmbed.includes('youtube.com/embed/');

  return (
    <>
      <section className="cd-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="shell">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Кейсы', href: '/keysy' }, { label: (caseData as any).client ?? caseData.title }]} />
          <div className="tags">
            {(caseData.tags ?? []).map((t: string, i: number) => (
              <span key={i} className="t">{t}</span>
            ))}
          </div>
          <h1>{caseData.title}</h1>
          <p className="sub">{caseData.sub}</p>
          <div className="cd-cover" style={{ height: 'clamp(280px, 42vw, 560px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {caseData.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={caseData.cover} alt={caseData.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }} />
            ) : (
              <>
                <PatternField psize={28} pgap={32} pbase="rgba(244,241,235,0.08)" paccent="#E2553A" />
                <div style={{ position: 'relative', zIndex: 2, opacity: 0.3 }}>
                  <Pinwheel size={200} color="#F4F1EB" accent="#E2553A" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="cd-body">
        <div className="shell cd-grid">
          <aside className="cd-aside">
            <div className="row"><div className="k">Клиент</div><div className="v">{(caseData as any).client}</div></div>
            <div className="row"><div className="k">Направление</div><div className="v">{caseData.direction}</div></div>
            <div className="row"><div className="k">Год</div><div className="v">{caseData.year}</div></div>
            <div className="row"><div className="k">Срок</div><div className="v">{caseData.term}</div></div>
            <div className="row">
              <div className="k">Стек</div>
              <div className="v">
                <div className="stack">
                  {(caseData.stack ?? []).map((s: string, i: number) => <span key={i}>{s}</span>)}
                </div>
              </div>
            </div>
          </aside>

          <div className="cd-content">
            <h2>Задача</h2>
            <p>{caseData.task}</p>
            {caseData.taskExtra && <p>{caseData.taskExtra}</p>}

            <h2>Что сделали</h2>
            <ul>
              {(caseData.solution ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>

            <h2>Результат</h2>
            <div className="cd-result">
              {(caseData.results ?? []).map((m: { mv: string; mk: string }, i: number) => (
                <div key={i} className="m">
                  <div className="mv" dangerouslySetInnerHTML={{ __html: m.mv }} />
                  <div className="mk">{m.mk}</div>
                </div>
              ))}
            </div>
            {caseData.closing && <p>{caseData.closing}</p>}

            {/* VIDEO BLOCK */}
            {videoEmbed && (
              <div className="cd-video" style={{ marginTop: 48 }}>
                <h2>Видео о проекте</h2>
                {isYoutube ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', background: '#14181F' }}>
                    <iframe
                      src={videoEmbed}
                      title="Видео о проекте"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                ) : (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={videoEmbed}
                    controls
                    style={{ width: '100%', borderRadius: 12, background: '#14181F' }}
                  />
                )}
              </div>
            )}

            {/* GALLERY BLOCK */}
            {caseData.gallery && caseData.gallery.length > 0 && (
              <div className="cd-gallery" style={{ marginTop: 48 }}>
                <h2>Скриншоты проекта</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {caseData.gallery.map((url: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt={`Скриншот ${i + 1}`}
                      style={{ width: '100%', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', display: 'block' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TESTIMONIAL BLOCK */}
            {(caseData.testimonialText || caseData.testimonialImage) && (
              <div className="cd-testimonial" style={{ marginTop: 48 }}>
                <h2>Благодарственное письмо</h2>
                <div style={{ display: 'grid', gridTemplateColumns: caseData.testimonialImage ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
                  {caseData.testimonialText && (
                    <div style={{
                      background: 'var(--surface, #14181F)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '24px 28px',
                      borderLeft: '3px solid #E2553A',
                    }}>
                      <p style={{ margin: 0, lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>{caseData.testimonialText}</p>
                    </div>
                  )}
                  {caseData.testimonialImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={caseData.testimonialImage}
                      alt="Благодарственное письмо"
                      style={{ width: '100%', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', display: 'block' }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shell">
          <div className="cd-nav">
            {(caseData as any).prev ? (
              <Link href={`/keysy/${(caseData as any).prev.slug}`} className="prev">
                <div className="d">← Предыдущий кейс</div>
                <div className="nm">{(caseData as any).prev.title}</div>
              </Link>
            ) : <div />}
            {(caseData as any).next ? (
              <Link href={`/keysy/${(caseData as any).next.slug}`} className="next">
                <div className="d">Следующий кейс →</div>
                <div className="nm">{(caseData as any).next.title}</div>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Похожая задача?</div>
          <h2>{(caseData as any).ctaTitle}</h2>
          <p>{(caseData as any).ctaDesc}</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <Link href="/keysy" className="btn btn-ghost">Все кейсы</Link>
          </div>
        </div>
      </section>
    </>
  );
}

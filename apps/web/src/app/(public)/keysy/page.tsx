import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCases } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { CaseFilter } from '@/components/ui/CaseFilter';

export const metadata: Metadata = {
  title: 'Кейсы',
  description: 'Проекты «Диджитал плюс»: сайты, CRM и личные кабинеты, мобильные приложения, интеграции с 1С и документация по 152-ФЗ.',
};

const FALLBACK_CASES = [
  {
    id: 1, slug: 'mg-ceramic', title: 'mg-ceramic.ru — сайт производителя керамики', direction: 'web', isFeatured: true,
    tags: ['Сайт', 'Каталог'], year: 2023,
    task: 'Заводу нужна была современная витрина продукции с каталогом для опта и розницы и приёмом заявок онлайн вместо переписки в мессенджерах.',
    solution: ['Адаптивный сайт с каталогом и фильтрами', 'Карточки товаров с характеристиками и наличием', 'Формы заявок опт/розница, интеграция с 1С'],
    results: [{ mv: 'Онлайн', mk: 'приём заявок' }, { mv: '1С', mk: 'остатки в реальном времени' }],
    stack: ['React', '1С', 'REST API', 'SEO'],
  },
  {
    id: 4, slug: 'crm-realty', title: 'CRM для агентства недвижимости с картой объектов', direction: 'crm', isFeatured: true,
    tags: ['CRM', 'Карта'], year: 2024,
    task: 'Агентству нужна была единая база объектов с отображением на карте вместо разрозненных таблиц и папок с фото.',
    solution: ['Карта объектов с кластеризацией и фильтрами', 'Карточки с фото, статусами и историей', 'Воронки сделок и распределение по агентам'],
    results: [{ mv: '1 база', mk: 'вместо таблиц' }, { mv: 'Карта', mk: 'всех объектов' }, { mv: 'Роли', mk: 'доступ по агентам' }],
    stack: ['React', 'Map API', 'PostgreSQL', 'Node'],
  },
  {
    id: 2, title: 'liumi.ru — сайт бренда', direction: 'web', isFeatured: false,
    tags: ['Сайт'], year: 2023,
    task: 'Имиджевый сайт бренда с чистой подачей продукта и заделом под SEO-продвижение.',
    solution: ['Дизайн и адаптивная вёрстка', 'Структура под контент и SEO', 'Скорость загрузки и метрики'],
    results: [{ mv: 'SEO', mk: 'база заложена' }, { mv: '100%', mk: 'адаптив' }],
    stack: ['React', 'SEO', 'CSS'],
  },
  {
    id: 3, title: 'Личный кабинет для отдела продаж MG-Ceramic', direction: 'crm', isFeatured: false,
    tags: ['Личный кабинет'], year: 2023,
    task: 'Дать менеджерам доступ к заказам, остаткам и клиентам в одном окне, синхронно с 1С.',
    solution: ['Кабинет с ролями и авторизацией', 'Заказы, статусы, остатки из 1С', 'История по клиентам'],
    results: [{ mv: '1 окно', mk: 'для менеджера' }, { mv: '1С', mk: 'данные в синхроне' }],
    stack: ['React', '1С', 'Auth / роли'],
  },
  {
    id: 5, slug: 'kurort', title: 'Сайт для АО «Курорт Нальчик»', direction: 'web', isFeatured: true,
    tags: ['Сайт', 'Гос / АО'], year: 2024,
    task: 'Официальный сайт курорта: услуги, инфраструктура, новости и приём заявок на отдых и лечение.',
    solution: ['Структура разделов услуг и объектов', 'Новости, документы, контакты', 'Формы заявок и обратной связи'],
    results: [{ mv: 'Витрина', mk: 'всех услуг курорта' }, { mv: 'Заявки', mk: 'онлайн' }, { mv: 'Адаптив', mk: 'моб. трафик' }],
    stack: ['React', 'CMS', 'SEO'],
  },
  {
    id: 6, title: 'Мобильное приложение «Курорт Нальчик»', direction: 'mobile', isFeatured: false,
    tags: ['Мобильное'], year: 2024,
    task: 'Приложение для гостей курорта: услуги, афиша, уведомления и заявки в кармане.',
    solution: ['Каталог услуг и инфраструктуры', 'Push-уведомления и афиша', 'Заявки и обратная связь'],
    results: [{ mv: 'iOS + Android', mk: 'один код' }, { mv: 'Push', mk: 'прямой контакт с гостем' }],
    stack: ['React Native', 'Push', 'REST API'],
  },
  {
    id: 7, title: 'CRM для отеля', direction: 'crm', isFeatured: false,
    tags: ['CRM', 'Отель'], year: 2024,
    task: 'Управлять бронированиями, номерным фондом и гостями без бумажной «шахматки».',
    solution: ['Шахматка номеров и броней', 'Карточки гостей и история', 'Статусы заездов и выездов'],
    results: [{ mv: 'Шахматка', mk: 'в реальном времени' }, { mv: '0', mk: 'двойных броней' }],
    stack: ['React', 'PostgreSQL', 'Node'],
  },
  {
    id: 8, slug: '1c-sync', title: 'Синхронизация 1С ↔ Яндекс.Товары ↔ сайты', direction: 'integration', isFeatured: true,
    tags: ['Интеграция', '1С'], year: 2024,
    task: 'Убрать ручную выгрузку товаров: цены, остатки и описания должны обновляться автоматически на всех площадках.',
    solution: ['Интеграционный слой с маппингом полей', 'Расписание выгрузок и обработка ошибок', 'Логи и контроль расхождений'],
    results: [{ mv: '−100%', mk: 'ручного труда' }, { mv: 'Авто', mk: 'цены и остатки' }, { mv: '0', mk: 'рассинхрона площадок' }],
    stack: ['1С', 'Яндекс API', 'ETL', 'Cron'],
  },
  {
    id: 9, title: 'Документы 152-ФЗ для медучреждения (ООО)', direction: 'fz152', isFeatured: false,
    tags: ['152-ФЗ', 'Медицина'], year: 2024,
    task: 'Привести обработку персональных данных пациентов в соответствие закону и подготовиться к проверке.',
    solution: ['Аудит процессов и сайта', 'Пакет политик и согласий', 'Уведомление в Роскомнадзор'],
    results: [{ mv: '0', mk: 'замечаний' }, { mv: 'Полный', mk: 'пакет документов' }],
    stack: ['Аудит', 'Политики', 'РКН'],
  },
  {
    id: 10, title: 'Документы 152-ФЗ для гостиницы (ООО)', direction: 'fz152', isFeatured: false,
    tags: ['152-ФЗ', 'Гостиница'], year: 2024,
    task: 'Оформить обработку данных гостей: бронирования, анкеты, видеонаблюдение.',
    solution: ['Аудит точек сбора данных', 'Политики, согласия, приказы', 'Уведомление и инструкции для персонала'],
    results: [{ mv: 'Готово', mk: 'к проверке' }, { mv: 'Персонал', mk: 'с инструкциями' }],
    stack: ['Аудит', 'Политики', 'РКН'],
  },
  {
    id: 11, title: 'Документы 152-ФЗ для интернет-магазина косметики (ИП)', direction: 'fz152', isFeatured: false,
    tags: ['152-ФЗ', 'E-commerce'], year: 2025,
    task: 'Закрыть требования закона для онлайн-магазина: формы, cookie, рассылки.',
    solution: ['Аудит форм и cookie на сайте', 'Политика, согласия, баннер cookie', 'Уведомление в РКН'],
    results: [{ mv: 'Сайт', mk: 'в соответствии' }, { mv: 'Cookie', mk: 'баннер и согласия' }],
    stack: ['Аудит', 'Политики', 'Cookie', 'РКН'],
  },
  {
    id: 12, title: 'React-модуль генерации лендингов + SEO', direction: 'web', isFeatured: false,
    tags: ['Сайт', 'SEO'], year: 2025,
    task: 'Быстро собирать посадочные страницы из блоков с готовой SEO-разметкой и высокой скоростью.',
    solution: ['Конструктор блоков на React', 'Авто мета-теги и разметка', 'Оптимизация скорости и Core Web Vitals'],
    results: [{ mv: 'Минуты', mk: 'на сборку лендинга' }, { mv: 'SEO', mk: 'из коробки' }],
    stack: ['React', 'SSR', 'SEO', 'Web Vitals'],
  },
];

export default async function KesyPage() {
  const apiCases = await fetchCases();
  const mapped = apiCases.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    direction: c.direction,
    tags: Array.isArray(c.tags) ? c.tags : [],
    year: c.year,
    isFeatured: c.isFeatured,
    task: c.taskText || '',
    solution: Array.isArray(c.solutionItems) ? c.solutionItems : [],
    results: Array.isArray(c.resultMetrics)
      ? c.resultMetrics
      : [],
    stack: Array.isArray(c.stack) ? c.stack : [],
  }));
  const cases = mapped.length > 0 ? mapped : FALLBACK_CASES;

  return (
    <>
      <section className="cases-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <div className="eyebrow">Портфолио</div>
          <h1>Кейсы, за которыми<br/>стоит <span className="accent">результат</span></h1>
          <p className="lead">Сайты, CRM и личные кабинеты, мобильные приложения, интеграции с 1С и документация по 152-ФЗ. Каждый проект — задача бизнеса, а не просто строчки кода.</p>
          <div className="stat-strip">
            <div className="s"><div className="v">12</div><div className="k">проектов в подборке</div></div>
            <div className="s"><div className="v">5</div><div className="k">направлений</div></div>
            <div className="s"><div className="v">5 <span className="accent">лет</span></div><div className="k">опыта</div></div>
            <div className="s"><div className="v">РФ</div><div className="k">Нальчик + удалённо</div></div>
          </div>
        </div>
      </section>

      <CaseFilter cases={cases} />

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Ваш проект — следующий</div>
          <h2>Расскажите задачу — предложим решение</h2>
          <p>Сайт, CRM, мобильное приложение, интеграция или документы по 152-ФЗ. Разберём вашу ситуацию и предложим план с фиксированными сроками.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <a href="tel:+79280104008" className="btn btn-ghost">8 928 010 40 08</a>
          </div>
        </div>
      </section>
    </>
  );
}

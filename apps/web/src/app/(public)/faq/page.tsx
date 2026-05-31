import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchFaq } from '@/lib/api';
import { PatternField } from '@/components/ui/PatternField';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: 'Вопросы и ответы',
  description: 'Частые вопросы о разработке сайтов и CRM, документации по 152-ФЗ, поддержке, оплате и договоре.',
};

const FALLBACK_CATS = [
  {
    id: 1, title: 'Общие',
    items: [
      { id: 1, question: 'Сколько стоит проект?', answer: 'Стоимость зависит от задач и объёма. После короткого брифа и анализа готовим смету с фиксированными этапами и сроками — без скрытых доплат. Ориентиры по пакетам есть на странице «Услуги». Первичная консультация бесплатна.' },
      { id: 2, question: 'Вы работаете с клиентами из других городов?', answer: 'Да. Мы в Нальчике, но работаем со всей Россией удалённо: встречи онлайн, документы по ЭДО, прозрачная отчётность и демонстрации по спринтам.' },
      { id: 3, question: 'Можно заказать только часть работ?', answer: 'Конечно. Подключаемся на нужном этапе — например, только дизайн, только интеграция с 1С или только пакет документов по 152-ФЗ.' },
    ],
  },
  {
    id: 2, title: 'Сайты и разработка',
    items: [
      { id: 4, question: 'Сколько времени занимает разработка сайта?', answer: 'Лендинг — от 2 недель, корпоративный сайт — от 4–6 недель, интернет-магазин — от 8 недель. Точные сроки фиксируем в договоре после этапа анализа.' },
      { id: 5, question: 'Можно ли интегрировать сайт с 1С?', answer: 'Да, это одна из наших профильных задач. Настраиваем автоматический обмен товарами, ценами и остатками между 1С, сайтом и маркетплейсами.' },
      { id: 6, question: 'Делаете ли вы SEO?', answer: 'Закладываем SEO-базу на этапе разработки: структура, мета-теги, скорость, микроразметка. Также делаем модуль генерации лендингов с SEO-оптимизацией.' },
    ],
  },
  {
    id: 3, title: 'CRM и кабинеты',
    items: [
      { id: 7, question: 'Вы внедряете готовую CRM или пишете свою?', answer: 'И то, и другое. Можем настроить готовое решение под ваши процессы, доработать кастомными модулями или разработать CRM/личный кабинет с нуля — например, с картой объектов или шахматкой номеров.' },
      { id: 8, question: 'Перенесёте ли вы наши данные в новую систему?', answer: 'Да. Миграция данных входит в работы: переносим клиентов, сделки и историю без потерь, с проверкой целостности.' },
    ],
  },
  {
    id: 4, title: '152-ФЗ',
    items: [
      { id: 9, question: 'Что входит в пакет по 152-ФЗ?', answer: 'Аудит обработки персональных данных, комплект политик и согласий, доработка сайта (баннеры, чекбоксы), подготовка и подача уведомления в РКН, инструкции и приказы для сотрудников.' },
      { id: 10, question: 'Поможете подготовиться к проверке?', answer: 'Да. Готовим к проверкам Роскомнадзора: проверяем процессы, документы и сайт, даём чек-лист и регламенты для персонала.' },
      { id: 11, question: 'Работаете с ИП и со спецданными (медицина)?', answer: 'Да. Оформляли документы и для ИП (интернет-магазин), и для ООО со спецкатегориями данных (медучреждение, гостиница). Под каждый случай — свой объём.' },
    ],
  },
  {
    id: 5, title: 'Поддержка',
    items: [
      { id: 12, question: 'Возьмёте на поддержку проект, который делали не вы?', answer: 'Да. Проводим технический аудит, фиксируем текущее состояние и берём проект на сопровождение по согласованному SLA с мониторингом и резервным копированием.' },
      { id: 13, question: 'Что такое SLA и как быстро вы реагируете?', answer: 'SLA — гарантированное время реакции на обращение. В зависимости от пакета это от «в течение рабочего дня» до приоритетной реакции в режиме 24/7.' },
    ],
  },
  {
    id: 6, title: 'Оплата и договор',
    items: [
      { id: 14, question: 'Как происходит оплата?', answer: 'Безналичный расчёт по договору, обычно с предоплатой и разбивкой на этапы. Работаем как ООО — предоставляем счёт, договор и закрывающие документы.' },
      { id: 15, question: 'Заключаете ли вы договор?', answer: 'Обязательно. Фиксируем объём, сроки и стоимость в договоре и приложениях. По завершении подписываем акт сдачи-приёмки.' },
      { id: 16, question: 'Что с гарантией на работы?', answer: 'На разработку даём гарантийный период, в течение которого бесплатно исправляем ошибки. Дальше проект можно перевести на регулярную поддержку.' },
    ],
  },
];

export default async function FaqPage() {
  const apiData = await fetchFaq();
  const categories = apiData.length > 0 ? apiData : FALLBACK_CATS;

  const allItems = FALLBACK_CATS.flatMap(c => c.items);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Вопросы и ответы' }]} />
          <h1>Вопросы<br/>и <span className="accent">ответы</span></h1>
          <p className="lead">Собрали то, что спрашивают чаще всего. Не нашли свой вопрос — напишите, ответим лично.</p>
        </div>
      </section>

      <section className="faq-page">
        <div className="shell" style={{ maxWidth: 860 }}>
          {(categories as typeof FALLBACK_CATS).map((cat) => (
            <div key={cat.id} className="faq-cat">
              <div className="cat-h">
                <div className="ic"><Pinwheel size={20} /></div>
                <h2>{cat.title}</h2>
              </div>
              <div className="faq">
                {cat.items.map((item) => (
                  <Accordion key={item.id} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Остались вопросы?</div>
          <h2>Спросите напрямую</h2>
          <p>Ответим на любой вопрос по вашему проекту и поможем выбрать решение.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Задать вопрос <span className="arr">→</span></Link>
            <a href="tel:+79280104008" className="btn btn-ghost">8 928 010 40 08</a>
          </div>
        </div>
      </section>
    </>
  );
}

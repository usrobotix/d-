import type { Metadata } from 'next';
import Link from 'next/link';
import { PatternField } from '@/components/ui/PatternField';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Отзывы и благодарности',
  description: 'Благодарственные письма, отзывы, видео и фото от клиентов «Диджитал плюс».',
};

const SCANS = [
  { id: 1, name: 'АО «Курорт Нальчик»', year: '2024' },
  { id: 2, name: 'MG-Ceramic', year: '2023' },
  { id: 3, name: 'Агентство недвижимости', year: '2024' },
  { id: 4, name: 'Медцентр', year: '2024' },
  { id: 5, name: 'Гостиница', year: '2024' },
  { id: 6, name: 'Liumi', year: '2023' },
  { id: 7, name: 'Отель', year: '2024' },
  { id: 8, name: 'Интернет-магазин', year: '2025' },
];

const QUOTES = [
  { id: 1, q: 'Сделали CRM ровно под наши процессы, а не наоборот. Карта объектов и карточки — то, чего так не хватало. Спустя год стабильно работает и развивается.', name: 'Артур Б.', role: 'Агентство недвижимости' },
  { id: 2, q: 'По 152-ФЗ закрыли вопрос полностью: документы, сайт, уведомление. Проверку прошли без единого замечания. Спокойствие того стоит.', name: 'Марина К.', role: 'Управляющая клиники' },
  { id: 3, q: 'Синхронизацию 1С с сайтом и Яндексом ждали давно. Теперь цены и остатки обновляются сами — забыли про ручные выгрузки навсегда.', name: 'Сергей М.', role: 'MG-Ceramic' },
  { id: 4, q: 'Сайт и мобильное приложение курорта сделали аккуратно и в срок. Гостям удобно, нам — поток заявок онлайн.', name: 'Залина Т.', role: 'АО «Курорт Нальчик»' },
  { id: 5, q: 'На поддержке у них спим спокойно: мониторинг ловит всё раньше нас, чинят быстро. Отвечают по делу, без воды.', name: 'Денис Р.', role: 'CTO, SaaS-платформа' },
  { id: 6, q: 'CRM для отеля убрала бумажную шахматку и двойные брони. Команда быстро освоилась — интерфейс понятный.', name: 'Оксана В.', role: 'Управляющая отелем' },
];

const VIDEOS = [
  { id: 1, name: 'Артур Б.', role: 'Агентство недвижимости' },
  { id: 2, name: 'Залина Т.', role: 'АО «Курорт Нальчик»' },
  { id: 3, name: 'Сергей М.', role: 'MG-Ceramic' },
];

export default function OtzyvyPage() {
  return (
    <>
      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Отзывы и благодарности' }]} />
          <h1>Нам <span className="accent">доверяют</span><br/>и говорят спасибо</h1>
          <p className="lead">Благодарственные письма, отзывы, видео и фото от клиентов. Реальные люди и компании, с которыми мы работали.</p>
        </div>
      </section>

      <div className="tab-bar">
        <div className="shell" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href="#scans" className="chip active">Благодарственные письма</a>
          <a href="#quotes" className="chip">Текстовые отзывы</a>
          <a href="#videos" className="chip">Видео</a>
          <a href="#photos" className="chip">Фото от клиентов</a>
        </div>
      </div>

      <section className="thanks">
        <div className="shell">

          {/* SCANS */}
          <div className="thanks-section" id="scans">
            <div className="sh">
              <h2>Благодарственные письма</h2>
              <span className="c">формат A4</span>
            </div>
            <div className="scans">
              {SCANS.map(scan => (
                <div key={scan.id} className="scan">
                  <div style={{ width: '100%', aspectRatio: '1 / 1.414', background: 'var(--ink-3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--mono)' }}>
                    Скан письма A4
                  </div>
                  <div className="cap">
                    <span className="nm">{scan.name}</span>
                    <span className="badge">{scan.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUOTES */}
          <div className="thanks-section" id="quotes">
            <div className="sh">
              <h2>Текстовые отзывы</h2>
              <span className="c">слова клиентов</span>
            </div>
            <div className="quotes">
              {QUOTES.map(q => (
                <div key={q.id} className="qcard">
                  <div className="stars">★★★★★</div>
                  <p className="q">{q.q}</p>
                  <div className="who">
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                      {q.name[0]}
                    </div>
                    <div>
                      <div className="nm">{q.name}</div>
                      <div className="rl">{q.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEOS */}
          <div className="thanks-section" id="videos">
            <div className="sh">
              <h2>Видео-отзывы</h2>
              <span className="c">перетащите постер кадра</span>
            </div>
            <div className="videos">
              {VIDEOS.map(v => (
                <div key={v.id} className="vcard">
                  <div className="vid">
                    <div style={{ width: '100%', aspectRatio: '16/10', background: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="play">
                        <div className="pbtn"></div>
                      </div>
                    </div>
                  </div>
                  <div className="meta">
                    <div className="nm">{v.name}</div>
                    <div className="rl">{v.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHOTOS */}
          <div className="thanks-section" id="photos">
            <div className="sh">
              <h2>Фото от клиентов</h2>
              <span className="c">живые снимки и процесс</span>
            </div>
            <div className="photos">
              {[
                { id: 1, cls: 'wide' },
                { id: 2, cls: 'tall' },
                { id: 3, cls: '' },
                { id: 4, cls: '' },
                { id: 5, cls: '' },
                { id: 6, cls: 'wide' },
                { id: 7, cls: '' },
                { id: 8, cls: '' },
              ].map(p => (
                <div
                  key={p.id}
                  className={p.cls}
                  style={{ background: 'var(--ink-3)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--mono)' }}
                >
                  Фото
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="section cases-cta">
        <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
        <div className="shell inner">
          <div className="eyebrow center">Станьте следующим</div>
          <h2>Сделаем проект, за который скажете спасибо</h2>
          <p>Расскажите задачу — предложим решение и доведём до результата.</p>
          <div className="cta-row">
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект <span className="arr">→</span></Link>
            <Link href="/keysy" className="btn btn-ghost">Смотреть кейсы</Link>
          </div>
        </div>
      </section>
    </>
  );
}

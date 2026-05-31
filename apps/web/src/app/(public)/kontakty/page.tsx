import type { Metadata } from 'next';
import { PatternField } from '@/components/ui/PatternField';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Связаться с «Диджитал плюс»: телефон, почта, мессенджеры, адрес в Нальчике и форма заявки.',
};

export default function KontaktyPage() {
  return (
    <>
      <section className="page-hero">
        <PatternField psize={30} pgap={34} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
        <div className="hero-glow"></div>
        <div className="shell inner">
          <Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} />
          <h1>Давайте <span className="accent">на связи</span></h1>
          <p className="lead">Позвоните, напишите в мессенджер или оставьте заявку — ответим в течение рабочего дня. Работаем по всей России удалённо.</p>
        </div>
      </section>

      <section className="contact-page">
        <div className="shell cp-grid">

          {/* LEFT */}
          <div>
            <div className="cp-cards">
              <a href="tel:+79280104008" className="cp-card">
                <div className="k">Телефон</div>
                <div className="v">8 928 010 40 08</div>
              </a>
              <a href="mailto:info@prodigitalplus.ru" className="cp-card">
                <div className="k">Почта</div>
                <div className="v sm">info@prodigitalplus.ru</div>
              </a>
              <div className="cp-card">
                <div className="k">Адрес</div>
                <div className="v sm">г. Нальчик,<br/>ул. Чернышевского, 272</div>
              </div>
              <div className="cp-card">
                <div className="k">Часы работы</div>
                <div className="v sm">Пн–Пт<br/>9:00 – 18:00</div>
              </div>
            </div>

            <div className="messengers">
              <a href="https://t.me/digitalplus_nalchik" target="_blank" rel="noopener">Telegram</a>
              <a href="https://wa.me/79280104008" target="_blank" rel="noopener">WhatsApp</a>
              <a href="https://vk.com/digitalplus_nalchik" target="_blank" rel="noopener">VK</a>
            </div>

            <div className="map-zone">
              <PatternField psize={26} pgap={30} pbase="rgba(244,241,235,0.06)" paccent="#E2553A" />
              <div className="pin">
                <div className="dot"></div>
                <div className="lbl">Диджитал плюс · Нальчик</div>
              </div>
              <a
                href="https://yandex.ru/maps/?text=%D0%9D%D0%B0%D0%BB%D1%8C%D1%87%D0%B8%D0%BA%2C+%D1%83%D0%BB%D0%B8%D1%86%D0%B0+%D0%A7%D0%B5%D1%80%D0%BD%D1%8B%D1%88%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE+272"
                target="_blank"
                rel="noopener"
                className="btn btn-ghost open-map"
              >
                Открыть на карте <span className="arr">→</span>
              </a>
            </div>

            <div className="req-card">
              <h3>Реквизиты</h3>
              <div className="req-row"><span className="k">Организация</span><span>ООО «Диджитал плюс»</span></div>
              <div className="req-row"><span className="k">ИНН</span><span>0700001458</span></div>
              <div className="req-row"><span className="k">КПП</span><span>070001001</span></div>
              <div className="req-row"><span className="k">ОГРН</span><span>1220700000014</span></div>
              <div className="req-row"><span className="k">Директор</span><span>Мерза Тамби Янал</span></div>
              <div className="req-row"><span className="k">Адрес</span><span>360004, г. Нальчик, ул. Чернышевского, д. 272</span></div>
            </div>
          </div>

          {/* RIGHT */}
          <div id="form">
            <div className="eyebrow" style={{ marginBottom: 20 }}>Форма заявки</div>
            <ContactForm />
          </div>

        </div>
      </section>
    </>
  );
}

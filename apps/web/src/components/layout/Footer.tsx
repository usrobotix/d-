import Link from 'next/link';
import { Pinwheel } from '@/components/ui/Pinwheel';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="f-brand">
            <Link href="/" className="logo">
              <span className="wm"><Pinwheel size={22} /></span>digital+
            </Link>
            <p>Разработка сайтов и CRM, документация 152-ФЗ и поддержка IT-проектов. С 2021 года.</p>
          </div>
          <div className="col">
            <h5>Услуги</h5>
            <Link href="/uslugi#web">Разработка сайтов</Link>
            <Link href="/uslugi#crm">Разработка CRM</Link>
            <Link href="/uslugi#fz152">Документация 152-ФЗ</Link>
            <Link href="/uslugi#support">IT-поддержка</Link>
          </div>
          <div className="col">
            <h5>Компания</h5>
            <Link href="/keysy">Кейсы</Link>
            <Link href="/otzyvy">Отзывы</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/kontakty">Контакты</Link>
          </div>
          <div className="col">
            <h5>Реквизиты</h5>
            <div className="req">
              ООО «Диджитал плюс»<br/>
              ИНН 0700001458<br/>
              ОГРН 1220700000014<br/>
              г. Нальчик, ул. Чернышевского, 272<br/>
              info@prodigitalplus.ru<br/>
              8 928 010 40 08
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="cp">© 2021–2026 Диджитал плюс</div>
          <div className="socials">
            <a href="https://t.me/digitalplus_nalchik" aria-label="Telegram" target="_blank" rel="noopener">tg</a>
            <a href="https://wa.me/79280104008" aria-label="WhatsApp" target="_blank" rel="noopener">wa</a>
            <a href="https://vk.com/digitalplus_nalchik" aria-label="VK" target="_blank" rel="noopener">vk</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

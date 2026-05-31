'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Pinwheel } from '@/components/ui/Pinwheel';
import { MobileMenu } from './MobileMenu';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(o => !o);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <header className="header">
        <div className="shell bar">
          <Link href="/" className="logo" onClick={closeMenu}>
            <span className="wm"><Pinwheel size={24} /></span>digital+
          </Link>
          <nav className="nav">
            <Link href="/uslugi">Услуги</Link>
            <Link href="/keysy">Кейсы</Link>
            <Link href="/otzyvy">Отзывы</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/kontakty">Контакты</Link>
          </nav>
          <div className="actions">
            <a href="tel:+79280104008" className="tel">8 928 010 40 08</a>
            <Link href="/kontakty" className="btn btn-primary">Обсудить проект</Link>
            <button
              className={`burger${menuOpen ? ' open' : ''}`}
              id="burger"
              aria-label="Меню"
              onClick={toggleMenu}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

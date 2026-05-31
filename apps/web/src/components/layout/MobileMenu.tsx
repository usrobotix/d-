'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu">
      <Link href="/uslugi" onClick={onClose}>Услуги</Link>
      <Link href="/keysy" onClick={onClose}>Кейсы</Link>
      <Link href="/otzyvy" onClick={onClose}>Отзывы</Link>
      <Link href="/faq" onClick={onClose}>FAQ</Link>
      <Link href="/kontakty" onClick={onClose}>Контакты</Link>
      <div className="m-actions">
        <a href="tel:+79280104008" className="btn btn-ghost" onClick={onClose}>8 928 010 40 08</a>
        <Link href="/kontakty" className="btn btn-primary" onClick={onClose}>Обсудить проект</Link>
      </div>
    </div>
  );
}

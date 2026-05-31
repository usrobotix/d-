'use client';
import { useState, useEffect } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utms: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => {
        const v = params.get(k);
        if (v) utms[k] = v;
      });
      setUtmParams(utms);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem('_hp') as HTMLInputElement)?.value;
    if (honeypot) return;

    setLoading(true);
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      contact: (form.elements.namedItem('contact') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      ...utmParams,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // continue anyway
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="form-success show">
        <div className="ok-ic">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3>Заявка отправлена</h3>
        <p>Спасибо! Свяжемся с вами в течение рабочего дня.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* honeypot */}
      <input type="text" name="_hp" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div className="row2">
        <div className="field">
          <label>Имя</label>
          <input type="text" name="name" placeholder="Как к вам обращаться" required />
        </div>
        <div className="field">
          <label>Телефон или почта</label>
          <input type="text" name="contact" placeholder="Для связи" required />
        </div>
      </div>
      <div className="field">
        <label>Услуга</label>
        <select name="service">
          <option>Разработка сайта</option>
          <option>Разработка / внедрение CRM</option>
          <option>Документация 152-ФЗ</option>
          <option>Поддержка IT-проекта</option>
          <option>Другое / не определился</option>
        </select>
      </div>
      <div className="field">
        <label>Коротко о задаче</label>
        <textarea name="message" placeholder="Что нужно сделать?"></textarea>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить заявку'} <span className="arr">→</span>
      </button>
      <p className="consent">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="#">политикой обработки персональных данных</a> в соответствии с 152-ФЗ.
      </p>
    </form>
  );
}

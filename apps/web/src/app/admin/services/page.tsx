'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type Service = { id: number; title: string; slug: string; published: boolean };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const load = () => fetch(`${API}/api/services`, { headers: h() }).then(r => r.json()).then(setServices).catch(() => {});
  useEffect(() => { load(); }, []);

  const togglePublished = async (s: Service) => {
    await fetch(`${API}/api/services/${s.id}`, { method: 'PATCH', headers: h(), body: JSON.stringify({ published: !s.published }) });
    setServices(ss => ss.map(x => x.id === s.id ? { ...x, published: !x.published } : x));
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Услуги</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {['Заголовок', 'Slug', 'Опубликован', 'Действия'].map(c => (
              <th key={c} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #262B35', fontFamily: 'monospace', color: '#8B8B92', fontWeight: 400 }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>{s.title}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35', fontFamily: 'monospace', fontSize: 12, color: '#8B8B92' }}>{s.slug}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>
                <button
                  onClick={() => togglePublished(s)}
                  style={{ background: s.published ? '#4BA876' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}
                >
                  {s.published ? 'Да' : 'Нет'}
                </button>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>
                <Link href={`/admin/services/${s.id}`} style={{ color: '#E2553A', textDecoration: 'none', fontSize: 13 }}>Редактировать</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

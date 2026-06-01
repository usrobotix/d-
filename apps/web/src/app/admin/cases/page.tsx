'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type Case = { id: number; title: string; direction: string; slug: string; status: string };

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);

  const load = () => fetch(`${API}/api/cases`, { headers: h() }).then(r => r.json()).then(setCases).catch(() => {});
  useEffect(() => { load(); }, []);

  const togglePublished = async (c: Case) => {
    await fetch(`${API}/api/cases/${c.id}`, { method: 'PUT', headers: h(), body: JSON.stringify({ status: c.status === 'published' ? 'draft' : 'published' }) });
    setCases(cs => cs.map(x => x.id === c.id ? { ...x, status: c.status === 'published' ? 'draft' : 'published' } : x));
  };

  const del = async (id: number) => {
    if (!confirm('Удалить кейс?')) return;
    await fetch(`${API}/api/cases/${id}`, { method: 'DELETE', headers: h() });
    setCases(cs => cs.filter(x => x.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Кейсы</h1>
        <Link href="/admin/cases/new" style={{ background: '#E2553A', color: '#fff', padding: '8px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}>+ Новый кейс</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {['Заголовок', 'Направление', 'Slug', 'Опубликован', 'Действия'].map(c => (
              <th key={c} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #262B35', fontFamily: 'monospace', color: '#8B8B92', fontWeight: 400 }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c.id}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>{c.title}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35', color: '#8B8B92' }}>{c.direction}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35', fontFamily: 'monospace', fontSize: 12, color: '#8B8B92' }}>{c.slug}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>
                <button
                  onClick={() => togglePublished(c)}
                  style={{ background: c.status === 'published' ? '#4BA876' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}
                >
                  {c.status === 'published' ? 'Да' : 'Нет'}
                </button>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>
                <Link href={`/admin/cases/${c.id}`} style={{ color: '#E2553A', marginRight: 12, textDecoration: 'none', fontSize: 13 }}>Ред.</Link>
                <button onClick={() => del(c.id)} style={{ background: '#E2553A', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

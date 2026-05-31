'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

const STATUS_COLORS: Record<string, string> = {
  new: '#E2553A', in_progress: '#D4A017', done: '#4BA876', spam: '#8B8B92',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', in_progress: 'В работе', done: 'Готово', spam: 'Спам',
};

type Lead = {
  id: number; name: string; phone: string; service: string; status: string;
  createdAt: string; message?: string; email?: string;
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => fetch(`${API}/api/leads`, { headers: h() }).then(r => r.json()).then(setLeads).catch(() => {});
  useEffect(() => { load(); }, []);

  const patch = async (id: number, status: string) => {
    await fetch(`${API}/api/leads/${id}`, { method: 'PATCH', headers: h(), body: JSON.stringify({ status }) });
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
  };

  const del = async (id: number) => {
    if (!confirm('Удалить заявку?')) return;
    await fetch(`${API}/api/leads/${id}`, { method: 'DELETE', headers: h() });
    setLeads(ls => ls.filter(l => l.id !== id));
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Заявки</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {['ID', 'Имя', 'Телефон', 'Услуга', 'Статус', 'Дата', 'Действия'].map(c => (
              <th key={c} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #262B35', fontFamily: 'monospace', color: '#8B8B92', fontWeight: 400 }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map(l => (
            <>
              <tr key={l.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === l.id ? null : l.id)}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35', color: '#8B8B92' }}>{l.id}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>{l.name}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>{l.phone}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>{l.service}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }}>
                  <span style={{ background: STATUS_COLORS[l.status] || '#8B8B92', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                    {STATUS_LABELS[l.status] || l.status}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35', color: '#8B8B92' }}>{new Date(l.createdAt).toLocaleDateString('ru')}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #262B35' }} onClick={e => e.stopPropagation()}>
                  <select
                    value={l.status}
                    onChange={e => patch(l.id, e.target.value)}
                    style={{ background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 4, padding: '4px 8px', marginRight: 8, cursor: 'pointer' }}
                  >
                    {Object.entries(STATUS_LABELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                  </select>
                  <button onClick={() => del(l.id)} style={{ background: '#E2553A', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Del</button>
                </td>
              </tr>
              {expanded === l.id && (
                <tr key={`${l.id}-exp`}>
                  <td colSpan={7} style={{ padding: '12px 16px', background: '#14181F', borderBottom: '1px solid #262B35' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                      <div><span style={{ color: '#8B8B92' }}>Email: </span>{l.email || '—'}</div>
                      <div><span style={{ color: '#8B8B92' }}>utm_source: </span>{l.utm_source || '—'}</div>
                      <div><span style={{ color: '#8B8B92' }}>utm_medium: </span>{l.utm_medium || '—'}</div>
                      <div><span style={{ color: '#8B8B92' }}>utm_campaign: </span>{l.utm_campaign || '—'}</div>
                      <div style={{ gridColumn: '1/-1' }}><span style={{ color: '#8B8B92' }}>Сообщение: </span>{l.message || '—'}</div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

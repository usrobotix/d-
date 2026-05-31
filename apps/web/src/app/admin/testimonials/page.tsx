'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type Testimonial = { id: number; type: string; authorName: string | null; authorRole: string | null; company: string | null; year: number | null; quote: string | null; rating: number | null; };
const TYPES = ['text', 'video', 'photo', 'scan'];
const empty = { type: 'text', authorName: '', authorRole: '', company: '', year: '', quote: '', rating: '5' };
const inp: React.CSSProperties = { background: '#0A0D12', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '7px 11px', width: '100%', fontSize: 13, boxSizing: 'border-box' };
const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });
const tdS: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #262B35', fontSize: 14 };
const thS: React.CSSProperties = { ...tdS, fontFamily: 'monospace', color: '#8B8B92', textAlign: 'left', fontWeight: 400 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);

  const load = () => fetch(`${API}/api/testimonials`, { headers: h() }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    const body = { type: form.type, authorName: form.authorName || null, authorRole: form.authorRole || null, company: form.company || null, year: form.year ? parseInt(form.year) : null, quote: form.quote || null, rating: form.rating ? parseInt(form.rating) : null };
    await fetch(`${API}/api/testimonials`, { method: 'POST', headers: h(), body: JSON.stringify(body) });
    setForm(empty); setShowAdd(false); load();
  };

  const save = async () => {
    if (!editForm) return;
    const { id, year, rating, ...rest } = editForm;
    const body = { ...rest, year: year ? parseInt(year) : null, rating: rating ? parseInt(rating) : null };
    await fetch(`${API}/api/testimonials/${id}`, { method: 'PUT', headers: h(), body: JSON.stringify(body) });
    setEditId(null); setEditForm(null); load();
  };

  const del = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    await fetch(`${API}/api/testimonials/${id}`, { method: 'DELETE', headers: h() });
    setItems(t => t.filter(x => x.id !== id));
  };

  const sf = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const ef = (k: string, v: string) => setEditForm((f: any) => f ? { ...f, [k]: v } : f);

  const FormFields = ({ vals, onChange }: { vals: any, onChange: (k: string, v: string) => void }) => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {['authorName', 'authorRole', 'company', 'year', 'rating'].map(k => (
          <div key={k}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>{k}</label>
            <input style={inp} value={vals[k] || ''} onChange={e => onChange(k, e.target.value)} /></div>
        ))}
        <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>type</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={vals.type} onChange={e => onChange('type', e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>quote</label>
        <textarea style={{ ...inp, minHeight: 80 }} value={vals.quote || ''} onChange={e => onChange('quote', e.target.value)} /></div>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Отзывы</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={btn(true)}>+ Добавить</button>
      </div>
      {showAdd && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, padding: 16, marginBottom: 24 }}>
          <FormFields vals={form} onChange={sf} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={add} style={btn(true)}>Сохранить</button>
            <button onClick={() => setShowAdd(false)} style={btn()}>Отмена</button>
          </div>
        </div>
      )}
      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Автор', 'Компания', 'Тип', 'Рейтинг', ''].map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {items.map(item => (
              editId === item.id && editForm ? (
                <tr key={item.id}>
                  <td colSpan={5} style={{ padding: 16, borderBottom: '1px solid #262B35' }}>
                    <FormFields vals={editForm} onChange={ef} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={save} style={btn(true)}>Сохранить</button>
                      <button onClick={() => { setEditId(null); setEditForm(null); }} style={btn()}>Отмена</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td style={tdS}>{item.authorName || '—'}</td>
                  <td style={{ ...tdS, color: '#8B8B92' }}>{item.company || '—'}</td>
                  <td style={tdS}><span style={{ background: '#262B35', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace' }}>{item.type}</span></td>
                  <td style={tdS}>{item.rating ? '★'.repeat(item.rating) : '—'}</td>
                  <td style={tdS}>
                    <button onClick={() => { setEditId(item.id); setEditForm({ ...item, year: item.year ? String(item.year) : '', rating: item.rating ? String(item.rating) : '' }); }} style={{ ...btn(), marginRight: 8 }}>Ред.</button>
                    <button onClick={() => del(item.id)} style={{ ...btn(), color: '#E2553A' }}>Del</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

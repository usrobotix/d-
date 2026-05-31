'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type Testimonial = { id: number; author: string; company: string; role: string; text: string; type: string; published: boolean };
const TYPES = ['text', 'video', 'photo', 'scan'];
const empty = { author: '', company: '', role: '', text: '', type: 'text', published: true };
const inp: React.CSSProperties = { background: '#0A0D12', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '7px 11px', width: '100%', fontSize: 13, boxSizing: 'border-box' };
const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });
const tdS: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #262B35', fontSize: 14 };
const thS: React.CSSProperties = { ...tdS, fontFamily: 'monospace', color: '#8B8B92', textAlign: 'left', fontWeight: 400 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Testimonial | null>(null);

  const load = () => fetch(`${API}/api/testimonials`, { headers: h() }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    await fetch(`${API}/api/testimonials`, { method: 'POST', headers: h(), body: JSON.stringify(form) });
    setForm(empty); setShowAdd(false); load();
  };

  const save = async () => {
    if (!editForm) return;
    await fetch(`${API}/api/testimonials/${editForm.id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(editForm) });
    setEditId(null); setEditForm(null); load();
  };

  const del = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    await fetch(`${API}/api/testimonials/${id}`, { method: 'DELETE', headers: h() });
    setItems(t => t.filter(x => x.id !== id));
  };

  const sf = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const ef = (k: string, v: string | boolean) => setEditForm(f => f ? { ...f, [k]: v } : f);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Отзывы</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={btn(true)}>+ Добавить</button>
      </div>

      {showAdd && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {(['author', 'company', 'role'] as const).map(k => (
              <div key={k}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>{k}</label><input style={inp} value={form[k]} onChange={e => sf(k, e.target.value)} /></div>
            ))}
            <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>type</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.type} onChange={e => sf('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>text</label><textarea style={{ ...inp, minHeight: 80 }} value={form.text} onChange={e => sf('text', e.target.value)} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.published} onChange={e => sf('published', e.target.checked)} /> Опубликован
            </label>
            <button onClick={add} style={btn(true)}>Сохранить</button>
            <button onClick={() => setShowAdd(false)} style={btn()}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Автор', 'Компания', 'Тип', 'Опубликован', ''].map(c => <th key={c} style={thS}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {items.map(item => (
              editId === item.id && editForm ? (
                <tr key={item.id}>
                  <td colSpan={5} style={{ padding: 16, borderBottom: '1px solid #262B35' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      {(['author', 'company', 'role'] as const).map(k => (
                        <div key={k}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>{k}</label><input style={inp} value={editForm[k]} onChange={e => ef(k, e.target.value)} /></div>
                      ))}
                      <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>type</label>
                        <select style={{ ...inp, cursor: 'pointer' }} value={editForm.type} onChange={e => ef('type', e.target.value)}>
                          {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>text</label><textarea style={{ ...inp, minHeight: 80 }} value={editForm.text} onChange={e => ef('text', e.target.value)} /></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={editForm.published} onChange={e => ef('published', e.target.checked)} /> Опубликован
                      </label>
                      <button onClick={save} style={btn(true)}>Сохранить</button>
                      <button onClick={() => { setEditId(null); setEditForm(null); }} style={btn()}>Отмена</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td style={tdS}>{item.author}</td>
                  <td style={{ ...tdS, color: '#8B8B92' }}>{item.company}</td>
                  <td style={tdS}><span style={{ background: '#262B35', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace' }}>{item.type}</span></td>
                  <td style={tdS}><span style={{ color: item.published ? '#4BA876' : '#8B8B92' }}>{item.published ? 'Да' : 'Нет'}</span></td>
                  <td style={tdS}>
                    <button onClick={() => { setEditId(item.id); setEditForm(item); }} style={{ ...btn(), marginRight: 8 }}>Ред.</button>
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

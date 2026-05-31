'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type Redirect = { id: number; from: string; to: string; code: number; active: boolean };
const empty = { from: '', to: '', code: 301, active: true };
const inp: React.CSSProperties = { background: '#0A0D12', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '7px 11px', fontSize: 13, boxSizing: 'border-box' as const };
const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });
const tdS: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #262B35', fontSize: 14 };
const thS: React.CSSProperties = { ...tdS, fontFamily: 'monospace', color: '#8B8B92', textAlign: 'left', fontWeight: 400 };

export default function RedirectsPage() {
  const [items, setItems] = useState<Redirect[]>([]);
  const [form, setForm] = useState(empty);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Redirect | null>(null);

  const load = () => fetch(`${API}/api/redirects`, { headers: h() }).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const add = async () => {
    await fetch(`${API}/api/redirects`, { method: 'POST', headers: h(), body: JSON.stringify(form) });
    setForm(empty); setShowAdd(false); load();
  };

  const save = async () => {
    if (!editForm) return;
    await fetch(`${API}/api/redirects/${editForm.id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(editForm) });
    setEditId(null); setEditForm(null); load();
  };

  const del = async (id: number) => {
    if (!confirm('Удалить редирект?')) return;
    await fetch(`${API}/api/redirects/${id}`, { method: 'DELETE', headers: h() });
    setItems(r => r.filter(x => x.id !== id));
  };

  const sf = (k: string, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));
  const ef = (k: string, v: string | number | boolean) => setEditForm(f => f ? { ...f, [k]: v } : f);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Редиректы</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={btn(true)}>+ Добавить</button>
      </div>

      {showAdd && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>От (from)</label>
              <input style={{ ...inp, width: '100%' }} placeholder="/old-path" value={form.from} onChange={e => sf('from', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>До (to)</label>
              <input style={{ ...inp, width: '100%' }} placeholder="/new-path" value={form.to} onChange={e => sf('to', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Код</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.code} onChange={e => sf('code', Number(e.target.value))}>
                <option value={301}>301</option>
                <option value={302}>302</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={form.active} onChange={e => sf('active', e.target.checked)} /> Активен
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={add} style={btn(true)}>Добавить</button>
            <button onClick={() => setShowAdd(false)} style={btn()}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['От', 'До', 'Код', 'Активен', ''].map(c => <th key={c} style={thS}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {items.map(item => (
              editId === item.id && editForm ? (
                <tr key={item.id}>
                  <td colSpan={5} style={{ padding: 12, borderBottom: '1px solid #262B35' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
                      <input style={{ ...inp, width: '100%' }} value={editForm.from} onChange={e => ef('from', e.target.value)} />
                      <input style={{ ...inp, width: '100%' }} value={editForm.to} onChange={e => ef('to', e.target.value)} />
                      <select style={{ ...inp, cursor: 'pointer' }} value={editForm.code} onChange={e => ef('code', Number(e.target.value))}>
                        <option value={301}>301</option><option value={302}>302</option>
                      </select>
                      <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={editForm.active} onChange={e => ef('active', e.target.checked)} /> Активен
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={save} style={btn(true)}>Сохранить</button>
                      <button onClick={() => { setEditId(null); setEditForm(null); }} style={btn()}>Отмена</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td style={{ ...tdS, fontFamily: 'monospace', fontSize: 13 }}>{item.from}</td>
                  <td style={{ ...tdS, fontFamily: 'monospace', fontSize: 13 }}>{item.to}</td>
                  <td style={tdS}><span style={{ background: '#262B35', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace' }}>{item.code}</span></td>
                  <td style={tdS}><span style={{ color: item.active ? '#4BA876' : '#8B8B92' }}>{item.active ? 'Да' : 'Нет'}</span></td>
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

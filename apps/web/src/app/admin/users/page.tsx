'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type User = { id: number; name: string; email: string; role: string; createdAt: string };
const ROLES = ['admin', 'editor', 'seo'];
const empty = { name: '', email: '', password: '', role: 'editor' };
const inp: React.CSSProperties = { background: '#0A0D12', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '7px 11px', width: '100%', fontSize: 13, boxSizing: 'border-box' };
const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });
const tdS: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #262B35', fontSize: 14 };
const thS: React.CSSProperties = { ...tdS, fontFamily: 'monospace', color: '#8B8B92', textAlign: 'left', fontWeight: 400 };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; role: string; password: string } | null>(null);
  const [err, setErr] = useState('');

  const load = () => fetch(`${API}/api/users`, { headers: h() }).then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => {
    load();
    fetch(`${API}/api/auth/me`, { headers: h() }).then(r => r.json()).then(d => setMe(d?.id)).catch(() => {});
  }, []);

  const add = async () => {
    setErr('');
    const r = await fetch(`${API}/api/users`, { method: 'POST', headers: h(), body: JSON.stringify(form) });
    if (!r.ok) { setErr(await r.text()); return; }
    setForm(empty); setShowAdd(false); load();
  };

  const save = async () => {
    if (!editId || !editForm) return;
    const body: any = { name: editForm.name, role: editForm.role };
    if (editForm.password) body.password = editForm.password;
    await fetch(`${API}/api/users/${editId}`, { method: 'PUT', headers: h(), body: JSON.stringify(body) });
    setEditId(null); setEditForm(null); load();
  };

  const del = async (id: number) => {
    if (id === me) { alert('Нельзя удалить себя'); return; }
    if (!confirm('Удалить пользователя?')) return;
    await fetch(`${API}/api/users/${id}`, { method: 'DELETE', headers: h() });
    setUsers(u => u.filter(x => x.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Пользователи</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={btn(true)}>+ Добавить</button>
      </div>

      {showAdd && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          {err && <div style={{ color: '#E2553A', fontSize: 13, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, alignItems: 'end' }}>
            {(['name', 'email', 'password'] as const).map(k => (
              <div key={k}>
                <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>{k}</label>
                <input style={inp} type={k === 'password' ? 'password' : 'text'} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Роль</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={add} style={btn(true)}>Создать</button>
            <button onClick={() => { setShowAdd(false); setErr(''); }} style={btn()}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Имя', 'Email', 'Роль', 'Дата', ''].map(c => <th key={c} style={thS}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {users.map(user => (
              editId === user.id && editForm ? (
                <tr key={user.id}>
                  <td colSpan={5} style={{ padding: 16, borderBottom: '1px solid #262B35' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Имя</label>
                        <input style={inp} value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} /></div>
                      <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Роль</label>
                        <select style={{ ...inp, cursor: 'pointer' }} value={editForm.role} onChange={e => setEditForm(f => f ? { ...f, role: e.target.value } : f)}>
                          {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select></div>
                      <div><label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Новый пароль (необязательно)</label>
                        <input style={inp} type="password" value={editForm.password} onChange={e => setEditForm(f => f ? { ...f, password: e.target.value } : f)} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={save} style={btn(true)}>Сохранить</button>
                      <button onClick={() => { setEditId(null); setEditForm(null); }} style={btn()}>Отмена</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td style={tdS}>{user.name} {user.id === me && <span style={{ fontSize: 11, color: '#8B8B92' }}>(вы)</span>}</td>
                  <td style={{ ...tdS, color: '#8B8B92' }}>{user.email}</td>
                  <td style={tdS}><span style={{ background: '#262B35', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace' }}>{user.role}</span></td>
                  <td style={{ ...tdS, color: '#8B8B92' }}>{new Date(user.createdAt).toLocaleDateString('ru')}</td>
                  <td style={tdS}>
                    <button onClick={() => { setEditId(user.id); setEditForm({ name: user.name, role: user.role, password: '' }); }} style={{ ...btn(), marginRight: 8 }}>Ред.</button>
                    <button onClick={() => del(user.id)} disabled={user.id === me} style={{ ...btn(), color: user.id === me ? '#8B8B92' : '#E2553A', opacity: user.id === me ? 0.4 : 1 }}>Del</button>
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

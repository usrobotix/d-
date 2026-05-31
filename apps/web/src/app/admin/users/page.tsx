'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
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

  const del = async (id: number) => {
    if (id === me) { alert('Нельзя удалить себя'); return; }
    if (!confirm('Удалить пользователя?')) return;
    await fetch(`${API}/api/users/${id}`, { method: 'DELETE', headers: h() });
    setUsers(u => u.filter(x => x.id !== id));
  };

  const sf = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Пользователи</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={btn(true)}>+ Добавить</button>
      </div>

      {showAdd && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          {err && <div style={{ color: '#E2553A', fontSize: 13, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Имя</label>
              <input style={inp} value={form.name} onChange={e => sf('name', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Email</label>
              <input style={inp} type="email" value={form.email} onChange={e => sf('email', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Пароль</label>
              <input style={inp} type="password" value={form.password} onChange={e => sf('password', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B8B92', fontSize: 12, marginBottom: 4 }}>Роль</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={form.role} onChange={e => sf('role', e.target.value)}>
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
              <tr key={user.id}>
                <td style={tdS}>{user.name} {user.id === me && <span style={{ fontSize: 11, color: '#8B8B92' }}>(вы)</span>}</td>
                <td style={{ ...tdS, color: '#8B8B92' }}>{user.email}</td>
                <td style={tdS}><span style={{ background: '#262B35', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace' }}>{user.role}</span></td>
                <td style={{ ...tdS, color: '#8B8B92' }}>{new Date(user.createdAt).toLocaleDateString('ru')}</td>
                <td style={tdS}>
                  <button
                    onClick={() => del(user.id)}
                    disabled={user.id === me}
                    style={{ ...btn(), color: user.id === me ? '#8B8B92' : '#E2553A', opacity: user.id === me ? 0.4 : 1 }}
                  >Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

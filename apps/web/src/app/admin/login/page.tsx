'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Неверные данные');
      localStorage.setItem('dp_token', data.token);
      localStorage.setItem('dp_user', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0D12' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 40, background: '#14181F', border: '1px solid #262B35', borderRadius: 14 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.03em', color: '#F4F1EB', marginBottom: 8 }}>digital+ admin</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#5F636C', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Войдите в панель управления</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8B8B92', marginBottom: 8 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@prodigitalplus.ru"
              style={{ width: '100%', background: '#0A0D12', border: '1px solid #333A47', borderRadius: 9, color: '#F4F1EB', fontSize: 15, padding: '13px 15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8B8B92', marginBottom: 8 }}>Пароль</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', background: '#0A0D12', border: '1px solid #333A47', borderRadius: 9, color: '#F4F1EB', fontSize: 15, padding: '13px 15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && <div style={{ color: '#E2553A', fontSize: 13, marginBottom: 16, fontFamily: 'var(--mono)' }}>{error}</div>}

          <button
            type="submit" disabled={loading}
            style={{ width: '100%', background: '#E2553A', color: '#fff', border: 'none', borderRadius: 9, padding: '14px', fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Вход...' : 'Войти →'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Stats {
  leads: number;
  cases: number;
  services: number;
  newLeads: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('dp_token');
    const userStr = localStorage.getItem('dp_user');
    if (!token) { router.push('/admin/login'); return; }
    if (userStr) setUser(JSON.parse(userStr));

    // Fetch dashboard stats
    Promise.all([
      fetch(`${API}/api/leads`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/cases`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/services`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
    ]).then(([leads, cases, services]) => {
      setStats({
        leads: leads.length || 0,
        cases: cases.length || 0,
        services: services.length || 0,
        newLeads: (leads || []).filter((l: { status: string }) => l.status === 'new').length,
      });
    }).catch(() => {
      setStats({ leads: 0, cases: 0, services: 0, newLeads: 0 });
    });
  }, [router]);

  const tiles = [
    { label: 'Новых заявок', value: stats?.newLeads ?? '…', href: '/admin/leads', accent: true },
    { label: 'Всего заявок', value: stats?.leads ?? '…', href: '/admin/leads' },
    { label: 'Кейсов', value: stats?.cases ?? '…', href: '/admin/cases' },
    { label: 'Услуг', value: stats?.services ?? '…', href: '/admin/services' },
  ];

  const quickLinks = [
    { href: '/admin/leads', label: '+ Заявки' },
    { href: '/admin/cases', label: '+ Кейс' },
    { href: '/admin/faq', label: '+ FAQ' },
    { href: '/admin/media', label: '📁 Медиа' },
    { href: '/admin/settings', label: '⚙ Настройки' },
    { href: '/admin/redirects', label: '↪ Редиректы' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>Дашборд</h1>
        {user && <p style={{ color: '#8B8B92', marginTop: 6, fontFamily: 'var(--mono)', fontSize: 12 }}>Добро пожаловать, {user.name} ({user.role})</p>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
        {tiles.map((tile, i) => (
          <Link key={i} href={tile.href} style={{
            background: tile.accent ? 'rgba(226,85,58,0.1)' : '#14181F',
            border: `1px solid ${tile.accent ? '#E2553A' : '#262B35'}`,
            borderRadius: 12, padding: '24px 20px', textDecoration: 'none', display: 'block',
          }}>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', color: tile.accent ? '#E2553A' : '#F4F1EB' }}>{tile.value}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8B8B92', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{tile.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#5F636C', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Быстрые действия</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {quickLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              background: '#14181F', border: '1px solid #262B35', borderRadius: 8,
              padding: '8px 14px', fontSize: 13, color: '#CFCABF', textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, padding: 24 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#E2553A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Система</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 13, color: '#8B8B92' }}>
          <div>API: <a href={`${API}/health`} target="_blank" rel="noopener" style={{ color: '#4BA876' }}>{API}</a></div>
          <div>Сайт: <a href="/" target="_blank" rel="noopener" style={{ color: '#CFCABF' }}>prodigitalplus.ru</a></div>
        </div>
      </div>
    </div>
  );
}

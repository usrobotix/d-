'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/leads', label: 'Заявки' },
  { href: '/admin/cases', label: 'Кейсы' },
  { href: '/admin/services', label: 'Услуги' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/testimonials', label: 'Отзывы' },
  { href: '/admin/media', label: 'Медиа' },
  { href: '/admin/settings', label: 'Настройки' },
  { href: '/admin/redirects', label: 'Редиректы' },
  { href: '/admin/users', label: 'Пользователи' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = () => { localStorage.removeItem('token'); router.push('/admin/login'); };
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0D12', color: '#F4F1EB' }}>
      <nav style={{ width: 220, borderRight: '1px solid #262B35', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <Link href="/" style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.03em', marginBottom: 24, color: '#F4F1EB', textDecoration: 'none' }}>digital+</Link>
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '9px 12px', borderRadius: 8, fontSize: 14, color: pathname === item.href ? '#F4F1EB' : '#8B8B92',
              background: pathname === item.href ? '#14181F' : 'transparent',
              textDecoration: 'none', transition: 'all .15s',
            }}
          >
            {item.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={logout} style={{ marginTop: 16, padding: '9px 12px', borderRadius: 8, fontSize: 14, color: '#8B8B92', background: 'transparent', border: '1px solid #262B35', cursor: 'pointer', textAlign: 'left' }}>
          Выйти
        </button>
      </nav>
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>{children}</main>
    </div>
  );
}

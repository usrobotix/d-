'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

const KEYS = [
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Адрес' },
  { key: 'rekvizity', label: 'Реквизиты' },
  { key: 'vk', label: 'ВКонтакте' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'ga_id', label: 'Google Analytics ID' },
  { key: 'ym_id', label: 'Яндекс.Метрика ID' },
];

const inp: React.CSSProperties = { background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 14, boxSizing: 'border-box' };

export default function SettingsPage() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings`, { headers: h() })
      .then(r => r.json())
      .then((d: { key: string; value: string }[]) => {
        const m: Record<string, string> = {};
        (Array.isArray(d) ? d : []).forEach(({ key, value }) => { m[key] = value; });
        setVals(m);
      }).catch(() => {});
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await Promise.all(
      KEYS.map(({ key }) =>
        fetch(`${API}/api/settings/${key}`, { method: 'PATCH', headers: h(), body: JSON.stringify({ value: vals[key] || '' }) })
      )
    );
    setSaving(false); setOk(true);
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Настройки</h1>
        <button onClick={saveAll} disabled={saving} style={{ background: '#E2553A', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 22px', cursor: 'pointer', fontSize: 14 }}>
          {saving ? 'Сохранение...' : ok ? '✓ Сохранено' : 'Сохранить всё'}
        </button>
      </div>
      <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 12, padding: 24 }}>
        {KEYS.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 5, color: '#8B8B92', fontSize: 13 }}>{label}</label>
            <input
              style={inp}
              value={vals[key] || ''}
              onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

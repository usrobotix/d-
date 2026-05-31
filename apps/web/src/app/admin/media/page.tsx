'use client';
import { useEffect, useState, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

type Media = { id: number; filename: string; size: number; url: string; createdAt: string };

const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => fetch(`${API}/api/media`, { headers: { Authorization: `Bearer ${tok()}` } })
    .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    await fetch(`${API}/api/media`, { method: 'POST', headers: { Authorization: `Bearer ${tok()}` }, body: fd });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Удалить файл?')) return;
    await fetch(`${API}/api/media/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tok()}` } });
    setItems(m => m.filter(x => x.id !== id));
  };

  const copy = (item: Media, id: number) => {
    const url = item.url || `/uploads/${item.filename}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  };

  const fmtSize = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  const isImg = (name: string) => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(name);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Медиа</h1>
        <label style={{ ...btn(true), display: 'inline-block', cursor: 'pointer' }}>
          {uploading ? 'Загрузка...' : '+ Загрузить файл'}
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={upload} disabled={uploading} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: 140, background: '#0A0D12', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {isImg(item.filename) ? (
                <img src={item.url || `/uploads/${item.filename}`} alt={item.filename} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#8B8B92', fontSize: 12, fontFamily: 'monospace', textAlign: 'center', padding: 8, wordBreak: 'break-all' }}>{item.filename}</span>
              )}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#F4F1EB', marginBottom: 2, wordBreak: 'break-all', lineHeight: 1.3 }}>{item.filename}</div>
              <div style={{ fontSize: 11, color: '#8B8B92', marginBottom: 10 }}>{fmtSize(item.size)} · {new Date(item.createdAt).toLocaleDateString('ru')}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy(item, item.id)} style={{ ...btn(), flex: 1, fontSize: 12, padding: '4px 8px' }}>
                  {copied === item.id ? 'Скопировано!' : 'Copy URL'}
                </button>
                <button onClick={() => del(item.id)} style={{ ...btn(), color: '#E2553A', padding: '4px 8px', fontSize: 12 }}>Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: '#8B8B92', padding: 60, fontSize: 14 }}>Нет файлов</div>
      )}
    </div>
  );
}

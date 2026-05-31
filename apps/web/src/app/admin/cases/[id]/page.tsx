'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

const slugify = (s: string) => s.toLowerCase().replace(/[^a-zа-яё0-9\s-]/gi, '').trim().replace(/\s+/g, '-');

const DIRECTIONS = ['web', 'crm', 'mobile', 'integration', 'fz152'];

type Form = {
  title: string; slug: string; direction: string; excerpt: string;
  challenge: string; solution: string; result: string; stack: string;
  published: boolean; metaTitle: string; metaDescription: string; ogImage: string;
  resultMetrics: string;
};

const empty: Form = {
  title: '', slug: '', direction: 'web', excerpt: '', challenge: '', solution: '',
  result: '', stack: '', published: false, metaTitle: '', metaDescription: '', ogImage: '', resultMetrics: '{}',
};

const inp = { background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 14, boxSizing: 'border-box' as const };
const label = { display: 'block' as const, marginBottom: 4, color: '#8B8B92', fontSize: 13 };
const field = { marginBottom: 16 };

export default function CaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`${API}/api/cases/${id}`, { headers: h() }).then(r => r.json()).then(d => {
        setForm({
          title: d.title || '', slug: d.slug || '', direction: d.direction || 'web',
          excerpt: d.excerpt || '', challenge: d.challenge || '', solution: d.solution || '',
          result: d.result || '', stack: Array.isArray(d.stack) ? d.stack.join(', ') : (d.stack || ''),
          published: !!d.published, metaTitle: d.metaTitle || '', metaDescription: d.metaDescription || '',
          ogImage: d.ogImage || '', resultMetrics: d.resultMetrics ? JSON.stringify(d.resultMetrics, null, 2) : '{}',
        });
      }).catch(() => {});
    }
  }, [id, isNew]);

  const set = (k: keyof Form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setErr('');
    try {
      let metrics: unknown = {};
      try { metrics = JSON.parse(form.resultMetrics); } catch { setErr('resultMetrics: невалидный JSON'); setSaving(false); return; }
      const body = {
        ...form,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        resultMetrics: metrics,
      };
      const url = isNew ? `${API}/api/cases` : `${API}/api/cases/${id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const r = await fetch(url, { method, headers: h(), body: JSON.stringify(body) });
      if (!r.ok) throw new Error(await r.text());
      router.push('/admin/cases');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <Link href="/admin/cases" style={{ color: '#8B8B92', textDecoration: 'none', fontSize: 14 }}>← Назад</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{isNew ? 'Новый кейс' : 'Редактировать кейс'}</h1>
      </div>
      {err && <div style={{ color: '#E2553A', marginBottom: 16, fontSize: 13 }}>{err}</div>}
      <div style={field}>
        <label style={label}>Заголовок</label>
        <input style={inp} value={form.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)); }} />
      </div>
      <div style={field}>
        <label style={label}>Slug</label>
        <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Направление</label>
        <select style={{ ...inp, cursor: 'pointer' }} value={form.direction} onChange={e => set('direction', e.target.value)}>
          {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={field}>
        <label style={label}>Краткое описание (excerpt)</label>
        <textarea style={{ ...inp, minHeight: 80 }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Задача (challenge)</label>
        <textarea style={{ ...inp, minHeight: 100 }} value={form.challenge} onChange={e => set('challenge', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Решение (solution)</label>
        <textarea style={{ ...inp, minHeight: 100 }} value={form.solution} onChange={e => set('solution', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Результат (result)</label>
        <textarea style={{ ...inp, minHeight: 100 }} value={form.result} onChange={e => set('result', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Стек (через запятую)</label>
        <input style={inp} value={form.stack} onChange={e => set('stack', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
      </div>
      <div style={field}>
        <label style={label}>resultMetrics (JSON)</label>
        <textarea style={{ ...inp, minHeight: 120, fontFamily: 'monospace', fontSize: 12 }} value={form.resultMetrics} onChange={e => set('resultMetrics', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Meta Title</label>
        <input style={inp} value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>Meta Description</label>
        <textarea style={{ ...inp, minHeight: 72 }} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
      </div>
      <div style={field}>
        <label style={label}>OG Image URL</label>
        <input style={inp} value={form.ogImage} onChange={e => set('ogImage', e.target.value)} />
      </div>
      <div style={{ ...field, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="pub" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <label htmlFor="pub" style={{ color: '#F4F1EB', fontSize: 14, cursor: 'pointer' }}>Опубликован</label>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={save} disabled={saving} style={{ background: '#E2553A', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <Link href="/admin/cases" style={{ background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>Отмена</Link>
      </div>
    </div>
  );
}

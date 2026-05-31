'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-');
const DIRECTIONS = ['web', 'crm', 'mobile', 'integration', 'fz152'];
const inp = { background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 14, boxSizing: 'border-box' as const };
const lbl = { display: 'block' as const, marginBottom: 4, color: '#8B8B92', fontSize: 13 };
const fld = { marginBottom: 16 };

type Form = {
  title: string; slug: string; h1: string; sub: string; direction: string;
  client: string; term: string; year: string; isFeatured: boolean;
  stack: string; tags: string; taskText: string; solutionItems: string;
  resultMetrics: string; closingText: string; sortOrder: string;
  status: string; seoTitle: string; seoDesc: string; ogImage: string;
  noindex: boolean;
};

const empty: Form = {
  title: '', slug: '', h1: '', sub: '', direction: 'web', client: '', term: '',
  year: String(new Date().getFullYear()), isFeatured: false, stack: '', tags: '',
  taskText: '', solutionItems: '', resultMetrics: '{}', closingText: '',
  sortOrder: '0', status: 'published', seoTitle: '', seoDesc: '', ogImage: '', noindex: false,
};

export default function CaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`${API}/api/cases/by-id/${id}`, { headers: h() }).then(r => r.json()).then(d => {
        setForm({
          title: d.title || '', slug: d.slug || '', h1: d.h1 || '', sub: d.sub || '',
          direction: d.direction || 'web', client: d.client || '', term: d.term || '',
          year: String(d.year || new Date().getFullYear()), isFeatured: !!d.isFeatured,
          stack: Array.isArray(d.stack) ? d.stack.join(', ') : '',
          tags: Array.isArray(d.tags) ? d.tags.join(', ') : '',
          taskText: d.taskText || '',
          solutionItems: Array.isArray(d.solutionItems) ? d.solutionItems.join('\n') : '',
          resultMetrics: d.resultMetrics ? JSON.stringify(d.resultMetrics, null, 2) : '{}',
          closingText: d.closingText || '', sortOrder: String(d.sortOrder || 0),
          status: d.status || 'published', seoTitle: d.seoTitle || '',
          seoDesc: d.seoDesc || '', ogImage: d.ogImage || '', noindex: !!d.noindex,
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
        title: form.title, slug: form.slug, h1: form.h1 || form.title, sub: form.sub || form.title,
        direction: form.direction, client: form.client || null, term: form.term || null,
        year: parseInt(form.year) || new Date().getFullYear(),
        isFeatured: form.isFeatured,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        taskText: form.taskText,
        solutionItems: form.solutionItems.split('\n').map(s => s.trim()).filter(Boolean),
        resultMetrics: metrics, closingText: form.closingText || null,
        sortOrder: parseInt(form.sortOrder) || 0, status: form.status,
        seoTitle: form.seoTitle || null, seoDesc: form.seoDesc || null,
        ogImage: form.ogImage || null, noindex: form.noindex,
      };
      const url = isNew ? `${API}/api/cases` : `${API}/api/cases/${id}`;
      const method = isNew ? 'POST' : 'PUT';
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
      <div style={fld}><label style={lbl}>Заголовок</label>
        <input style={inp} value={form.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)); }} /></div>
      <div style={fld}><label style={lbl}>Slug</label>
        <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>H1</label>
        <input style={inp} value={form.h1} onChange={e => set('h1', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Подзаголовок (sub)</label>
        <input style={inp} value={form.sub} onChange={e => set('sub', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Направление</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={form.direction} onChange={e => set('direction', e.target.value)}>
            {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select></div>
        <div><label style={lbl}>Клиент</label>
          <input style={inp} value={form.client} onChange={e => set('client', e.target.value)} /></div>
        <div><label style={lbl}>Год</label>
          <input style={inp} value={form.year} onChange={e => set('year', e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Срок (term)</label>
          <input style={inp} value={form.term} onChange={e => set('term', e.target.value)} /></div>
        <div><label style={lbl}>Порядок сортировки</label>
          <input style={inp} value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></div>
      </div>
      <div style={fld}><label style={lbl}>Стек (через запятую)</label>
        <input style={inp} value={form.stack} onChange={e => set('stack', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Теги (через запятую)</label>
        <input style={inp} value={form.tags} onChange={e => set('tags', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Задача (taskText)</label>
        <textarea style={{ ...inp, minHeight: 100 }} value={form.taskText} onChange={e => set('taskText', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Решения (solutionItems, каждый пункт с новой строки)</label>
        <textarea style={{ ...inp, minHeight: 100 }} value={form.solutionItems} onChange={e => set('solutionItems', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>resultMetrics (JSON)</label>
        <textarea style={{ ...inp, minHeight: 100, fontFamily: 'monospace', fontSize: 12 }} value={form.resultMetrics} onChange={e => set('resultMetrics', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Заключение (closingText)</label>
        <textarea style={{ ...inp, minHeight: 80 }} value={form.closingText} onChange={e => set('closingText', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>SEO Title</label>
        <input style={inp} value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>SEO Description</label>
        <textarea style={{ ...inp, minHeight: 72 }} value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>OG Image URL</label>
        <input style={inp} value={form.ogImage} onChange={e => set('ogImage', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Статус</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="published">Опубликован</option>
            <option value="draft">Черновик</option>
          </select></div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#F4F1EB', fontSize: 14 }}>
          <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} /> Избранный
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#F4F1EB', fontSize: 14 }}>
          <input type="checkbox" checked={form.noindex} onChange={e => set('noindex', e.target.checked)} /> Noindex
        </label>
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

'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

const inp = { background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 14, boxSizing: 'border-box' as const };
const labelS = { display: 'block' as const, marginBottom: 4, color: '#8B8B92', fontSize: 13 };
const field = { marginBottom: 16 };

type Form = {
  title: string; slug: string; tagline: string; description: string;
  metaTitle: string; metaDescription: string; published: boolean;
  includes: string; steps: string; tiers: string;
};

const empty: Form = {
  title: '', slug: '', tagline: '', description: '', metaTitle: '', metaDescription: '',
  published: false, includes: '[]', steps: '[]', tiers: '[]',
};

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${API}/api/services/${id}`, { headers: h() }).then(r => r.json()).then(d => {
      setForm({
        title: d.title || '', slug: d.slug || '', tagline: d.tagline || '',
        description: d.description || '', metaTitle: d.metaTitle || '', metaDescription: d.metaDescription || '',
        published: !!d.published,
        includes: JSON.stringify(d.includes ?? [], null, 2),
        steps: JSON.stringify(d.steps ?? [], null, 2),
        tiers: JSON.stringify(d.tiers ?? [], null, 2),
      });
    }).catch(() => {});
  }, [id]);

  const set = (k: keyof Form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setErr('');
    try {
      let inc: unknown, steps: unknown, tiers: unknown;
      try { inc = JSON.parse(form.includes); } catch { setErr('includes: невалидный JSON'); setSaving(false); return; }
      try { steps = JSON.parse(form.steps); } catch { setErr('steps: невалидный JSON'); setSaving(false); return; }
      try { tiers = JSON.parse(form.tiers); } catch { setErr('tiers: невалидный JSON'); setSaving(false); return; }
      const body = { ...form, includes: inc, steps, tiers };
      const r = await fetch(`${API}/api/services/${id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(body) });
      if (!r.ok) throw new Error(await r.text());
      router.push('/admin/services');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <Link href="/admin/services" style={{ color: '#8B8B92', textDecoration: 'none', fontSize: 14 }}>← Назад</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Редактировать услугу</h1>
      </div>
      {err && <div style={{ color: '#E2553A', marginBottom: 16, fontSize: 13 }}>{err}</div>}
      <div style={field}><label style={labelS}>Заголовок</label><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></div>
      <div style={field}><label style={labelS}>Slug</label><input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} /></div>
      <div style={field}><label style={labelS}>Tagline</label><input style={inp} value={form.tagline} onChange={e => set('tagline', e.target.value)} /></div>
      <div style={field}><label style={labelS}>Описание</label><textarea style={{ ...inp, minHeight: 120 }} value={form.description} onChange={e => set('description', e.target.value)} /></div>
      <div style={field}><label style={labelS}>Meta Title</label><input style={inp} value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} /></div>
      <div style={field}><label style={labelS}>Meta Description</label><textarea style={{ ...inp, minHeight: 72 }} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} /></div>
      <div style={field}><label style={labelS}>includes (JSON)</label><textarea style={{ ...inp, minHeight: 120, fontFamily: 'monospace', fontSize: 12 }} value={form.includes} onChange={e => set('includes', e.target.value)} /></div>
      <div style={field}><label style={labelS}>steps (JSON)</label><textarea style={{ ...inp, minHeight: 120, fontFamily: 'monospace', fontSize: 12 }} value={form.steps} onChange={e => set('steps', e.target.value)} /></div>
      <div style={field}><label style={labelS}>tiers (JSON)</label><textarea style={{ ...inp, minHeight: 120, fontFamily: 'monospace', fontSize: 12 }} value={form.tiers} onChange={e => set('tiers', e.target.value)} /></div>
      <div style={{ ...field, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="pub" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <label htmlFor="pub" style={{ color: '#F4F1EB', fontSize: 14, cursor: 'pointer' }}>Опубликован</label>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={save} disabled={saving} style={{ background: '#E2553A', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <Link href="/admin/services" style={{ background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>Отмена</Link>
      </div>
    </div>
  );
}

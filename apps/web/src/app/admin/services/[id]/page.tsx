'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });
const inp = { background: '#14181F', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 14, boxSizing: 'border-box' as const };
const lbl = { display: 'block' as const, marginBottom: 4, color: '#8B8B92', fontSize: 13 };
const fld = { marginBottom: 16 };

type Form = {
  slug: string; eyebrow: string; title: string; description: string; forWho: string;
  includes: string; steps: string; tiers: string; priceNote: string;
  sortOrder: string; published: boolean; seoTitle: string; seoDesc: string;
  seoKeywords: string; ogImage: string; noindex: boolean;
};

const empty: Form = {
  slug: '', eyebrow: '', title: '', description: '', forWho: '',
  includes: '[]', steps: '[]', tiers: '[]', priceNote: '',
  sortOrder: '0', published: true, seoTitle: '', seoDesc: '',
  seoKeywords: '', ogImage: '', noindex: false,
};

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`${API}/api/services/by-id/${id}`, { headers: h() }).then(r => r.json()).then(d => {
        setForm({
          slug: d.slug || '', eyebrow: d.eyebrow || '', title: d.title || '',
          description: d.description || '', forWho: d.forWho || '',
          includes: JSON.stringify(d.includes || [], null, 2),
          steps: JSON.stringify(d.steps || [], null, 2),
          tiers: JSON.stringify(d.tiers || [], null, 2),
          priceNote: d.priceNote || '', sortOrder: String(d.sortOrder || 0),
          published: !!d.published, seoTitle: d.seoTitle || '',
          seoDesc: d.seoDesc || '', seoKeywords: d.seoKeywords || '',
          ogImage: d.ogImage || '', noindex: !!d.noindex,
        });
      }).catch(() => {});
    }
  }, [id, isNew]);

  const set = (k: keyof Form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setErr('');
    try {
      let includes, steps, tiers;
      try { includes = JSON.parse(form.includes); } catch { setErr('includes: невалидный JSON'); setSaving(false); return; }
      try { steps = JSON.parse(form.steps); } catch { setErr('steps: невалидный JSON'); setSaving(false); return; }
      try { tiers = JSON.parse(form.tiers); } catch { setErr('tiers: невалидный JSON'); setSaving(false); return; }
      const body = {
        slug: form.slug, eyebrow: form.eyebrow, title: form.title,
        description: form.description, forWho: form.forWho,
        includes, steps, tiers, priceNote: form.priceNote || null,
        sortOrder: parseInt(form.sortOrder) || 0, published: form.published,
        seoTitle: form.seoTitle || null, seoDesc: form.seoDesc || null,
        seoKeywords: form.seoKeywords || null, ogImage: form.ogImage || null,
        noindex: form.noindex,
      };
      const url = isNew ? `${API}/api/services` : `${API}/api/services/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const r = await fetch(url, { method, headers: h(), body: JSON.stringify(body) });
      if (!r.ok) throw new Error(await r.text());
      router.push('/admin/services');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <Link href="/admin/services" style={{ color: '#8B8B92', textDecoration: 'none', fontSize: 14 }}>← Назад</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{isNew ? 'Новая услуга' : 'Редактировать услугу'}</h1>
      </div>
      {err && <div style={{ color: '#E2553A', marginBottom: 16, fontSize: 13 }}>{err}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Slug</label><input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} /></div>
        <div><label style={lbl}>Eyebrow (01 — Веб)</label><input style={inp} value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} /></div>
      </div>
      <div style={fld}><label style={lbl}>Заголовок</label><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Описание</label><textarea style={{ ...inp, minHeight: 100 }} value={form.description} onChange={e => set('description', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Кому подойдёт (forWho)</label><textarea style={{ ...inp, minHeight: 72 }} value={form.forWho} onChange={e => set('forWho', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Что входит (includes, JSON)</label><textarea style={{ ...inp, minHeight: 150, fontFamily: 'monospace', fontSize: 12 }} value={form.includes} onChange={e => set('includes', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Этапы (steps, JSON)</label><textarea style={{ ...inp, minHeight: 150, fontFamily: 'monospace', fontSize: 12 }} value={form.steps} onChange={e => set('steps', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Пакеты (tiers, JSON)</label><textarea style={{ ...inp, minHeight: 150, fontFamily: 'monospace', fontSize: 12 }} value={form.tiers} onChange={e => set('tiers', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>Примечание к цене</label><input style={inp} value={form.priceNote} onChange={e => set('priceNote', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Порядок сортировки</label><input style={inp} value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></div>
      </div>
      <div style={fld}><label style={lbl}>SEO Title</label><input style={inp} value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>SEO Description</label><textarea style={{ ...inp, minHeight: 72 }} value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>SEO Keywords</label><input style={inp} value={form.seoKeywords} onChange={e => set('seoKeywords', e.target.value)} /></div>
      <div style={fld}><label style={lbl}>OG Image URL</label><input style={inp} value={form.ogImage} onChange={e => set('ogImage', e.target.value)} /></div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#F4F1EB', fontSize: 14 }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Опубликован
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#F4F1EB', fontSize: 14 }}>
          <input type="checkbox" checked={form.noindex} onChange={e => set('noindex', e.target.checked)} /> Noindex
        </label>
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

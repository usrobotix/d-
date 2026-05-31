'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const tok = () => typeof window !== 'undefined' ? localStorage.getItem('dp_token') || '' : '';
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });

type FaqItem = { id: number; question: string; answer: string; categoryId: number };
type FaqCategory = { id: number; name: string; items: FaqItem[] };

const inp: React.CSSProperties = { background: '#0A0D12', color: '#F4F1EB', border: '1px solid #262B35', borderRadius: 6, padding: '7px 11px', width: '100%', fontSize: 13, boxSizing: 'border-box' };
const btn = (accent = false): React.CSSProperties => ({ background: accent ? '#E2553A' : '#14181F', color: '#fff', border: '1px solid #262B35', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', fontSize: 13 });

export default function FaqPage() {
  const [cats, setCats] = useState<FaqCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [showCatForm, setShowCatForm] = useState(false);
  const [editCat, setEditCat] = useState<{ id: number; name: string } | null>(null);
  const [newItem, setNewItem] = useState<{ catId: number; q: string; a: string } | null>(null);
  const [editItem, setEditItem] = useState<FaqItem | null>(null);

  const load = () => fetch(`${API}/api/faq`, { headers: h() }).then(r => r.json()).then(d => setCats(Array.isArray(d) ? d : d.categories || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const addCat = async () => {
    if (!newCatName.trim()) return;
    await fetch(`${API}/api/faq/categories`, { method: 'POST', headers: h(), body: JSON.stringify({ name: newCatName }) });
    setNewCatName(''); setShowCatForm(false); load();
  };

  const saveCat = async () => {
    if (!editCat) return;
    await fetch(`${API}/api/faq/categories/${editCat.id}`, { method: 'PUT', headers: h(), body: JSON.stringify({ name: editCat.name }) });
    setEditCat(null); load();
  };

  const delCat = async (id: number) => {
    if (!confirm('Удалить категорию и все вопросы?')) return;
    await fetch(`${API}/api/faq/categories/${id}`, { method: 'DELETE', headers: h() });
    load();
  };

  const addItem = async () => {
    if (!newItem || !newItem.q.trim()) return;
    await fetch(`${API}/api/faq/items`, { method: 'POST', headers: h(), body: JSON.stringify({ categoryId: newItem.catId, question: newItem.q, answer: newItem.a }) });
    setNewItem(null); load();
  };

  const saveItem = async () => {
    if (!editItem) return;
    await fetch(`${API}/api/faq/items/${editItem.id}`, { method: 'PUT', headers: h(), body: JSON.stringify({ question: editItem.question, answer: editItem.answer }) });
    setEditItem(null); load();
  };

  const delItem = async (id: number) => {
    if (!confirm('Удалить вопрос?')) return;
    await fetch(`${API}/api/faq/items/${id}`, { method: 'DELETE', headers: h() });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>FAQ</h1>
        <button onClick={() => setShowCatForm(!showCatForm)} style={btn(true)}>+ Добавить категорию</button>
      </div>

      {showCatForm && (
        <div style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', gap: 10 }}>
          <input style={{ ...inp, flex: 1 }} placeholder="Название категории" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
          <button onClick={addCat} style={btn(true)}>Добавить</button>
          <button onClick={() => setShowCatForm(false)} style={btn()}>Отмена</button>
        </div>
      )}

      {cats.map(cat => (
        <div key={cat.id} style={{ background: '#14181F', border: '1px solid #262B35', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #262B35' }}>
            {editCat?.id === cat.id ? (
              <>
                <input style={{ ...inp, flex: 1 }} value={editCat.name} onChange={e => setEditCat({ ...editCat, name: e.target.value })} />
                <button onClick={saveCat} style={btn(true)}>Сохранить</button>
                <button onClick={() => setEditCat(null)} style={btn()}>Отмена</button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, flex: 1 }}>{cat.name}</span>
                <button onClick={() => setEditCat({ id: cat.id, name: cat.name })} style={btn()}>Ред.</button>
                <button onClick={() => delCat(cat.id)} style={{ ...btn(), color: '#E2553A' }}>Del</button>
                <button onClick={() => setNewItem({ catId: cat.id, q: '', a: '' })} style={btn(true)}>+ Вопрос</button>
              </>
            )}
          </div>

          {newItem?.catId === cat.id && (
            <div style={{ padding: 12, borderBottom: '1px solid #262B35', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input style={inp} placeholder="Вопрос" value={newItem.q} onChange={e => setNewItem({ ...newItem, q: e.target.value })} />
              <textarea style={{ ...inp, minHeight: 72 }} placeholder="Ответ" value={newItem.a} onChange={e => setNewItem({ ...newItem, a: e.target.value })} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addItem} style={btn(true)}>Добавить</button>
                <button onClick={() => setNewItem(null)} style={btn()}>Отмена</button>
              </div>
            </div>
          )}

          {(cat.items || []).map(item => (
            <div key={item.id} style={{ padding: '10px 16px', borderBottom: '1px solid #262B35' }}>
              {editItem?.id === item.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input style={inp} value={editItem.question} onChange={e => setEditItem({ ...editItem, question: e.target.value })} />
                  <textarea style={{ ...inp, minHeight: 64 }} value={editItem.answer} onChange={e => setEditItem({ ...editItem, answer: e.target.value })} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveItem} style={btn(true)}>Сохранить</button>
                    <button onClick={() => setEditItem(null)} style={btn()}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{item.question}</div>
                    <div style={{ color: '#8B8B92', fontSize: 13 }}>{item.answer}</div>
                  </div>
                  <button onClick={() => setEditItem(item)} style={btn()}>Ред.</button>
                  <button onClick={() => delItem(item.id)} style={{ ...btn(), color: '#E2553A' }}>Del</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { PatternField } from './PatternField';
import { Pinwheel } from './Pinwheel';

interface CaseItem {
  id?: number;
  slug?: string;
  title: string;
  direction?: string;
  tags?: string[];
  year?: string | number;
  task?: string;
  solution?: string[];
  results?: Array<{ mv: string; mk: string }>;
  stack?: string[];
  isFeatured?: boolean;
}

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'web', label: 'Сайты' },
  { key: 'crm', label: 'CRM и кабинеты' },
  { key: 'mobile', label: 'Мобильные' },
  { key: 'integration', label: 'Интеграции' },
  { key: 'fz152', label: '152-ФЗ' },
];

export function CaseFilter({ cases }: { cases: CaseItem[] }) {
  const [active, setActive] = useState('all');

  const filtered = active === 'all' ? cases : cases.filter(c => c.direction === active || c.tags?.some(t => t.toLowerCase().includes(active)));

  function countFor(key: string) {
    if (key === 'all') return cases.length;
    return cases.filter(c => c.direction === key || c.tags?.some(t => t.toLowerCase().includes(key))).length;
  }

  return (
    <>
      <div className="filterbar">
        <div className="shell row">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`chip${active === f.key ? ' active' : ''}`}
              onClick={() => setActive(f.key)}
            >
              {f.label} <span className="cnt">{countFor(f.key)}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="kases">
        <div className="shell">
          <div className="kases-grid">
            {filtered.map((c, i) => (
              <article key={c.id ?? i} className={`kase reveal${c.isFeatured ? ' feat' : ''}`} data-cat={c.direction ?? ''}>
                <div className="band">
                  <PatternField psize={c.isFeatured ? 22 : 20} pgap={c.isFeatured ? 26 : 24} pbase="rgba(244,241,235,0.07)" paccent="#E2553A" />
                  <div className="tags">
                    {(c.tags ?? []).map((t, ti) => (
                      <span key={ti} className="t">{t}</span>
                    ))}
                  </div>
                  {c.year && <span className="yr">{c.year}</span>}
                  <div className="big-mark">
                    <Pinwheel size={c.isFeatured ? 150 : 120} color="rgba(244,241,235,0.14)" accent="rgba(226,85,58,0.14)" />
                  </div>
                </div>
                <div className="body">
                  <h3>{c.title}</h3>
                  {c.isFeatured ? (
                    <div className="blk-row">
                      {c.task && (
                        <div className="blk">
                          <span className="bl">Задача</span>
                          <p>{c.task}</p>
                        </div>
                      )}
                      {c.solution && c.solution.length > 0 && (
                        <div className="blk">
                          <span className="bl">Решение</span>
                          <ul>{c.solution.map((s, si) => <li key={si}>{s}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {c.task && (
                        <div className="blk">
                          <span className="bl">Задача</span>
                          <p>{c.task}</p>
                        </div>
                      )}
                      {c.solution && c.solution.length > 0 && (
                        <div className="blk">
                          <span className="bl">Решение</span>
                          <ul>{c.solution.map((s, si) => <li key={si}>{s}</li>)}</ul>
                        </div>
                      )}
                    </>
                  )}
                  {c.results && c.results.length > 0 && (
                    <div className="result">
                      {c.results.map((m, mi) => (
                        <div key={mi} className="m">
                          <div className="mv" dangerouslySetInnerHTML={{ __html: m.mv }} />
                          <div className="mk">{m.mk}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {c.stack && c.stack.length > 0 && (
                    <div className="stack">
                      {c.stack.map((s, si) => <span key={si}>{s}</span>)}
                    </div>
                  )}
                  {c.slug && (
                    <a href={`/keysy/${c.slug}`} className="btn btn-ghost" style={{ marginTop: 20, alignSelf: 'flex-start' }}>
                      Открыть кейс <span className="arr">→</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state show">В этом направлении пока нет опубликованных кейсов.</div>
          )}
        </div>
      </section>
    </>
  );
}

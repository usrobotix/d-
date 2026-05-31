'use client';
import { useState } from 'react';
export function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`item${open ? ' open' : ''}`}>
      <button className="q" onClick={() => setOpen(!open)}>
        {question} <span className="ind"></span>
      </button>
      <div className="a" style={{ maxHeight: open ? 1000 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
        <div className="inner" dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  );
}

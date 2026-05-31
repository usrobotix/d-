'use client';
import { useEffect, useRef } from 'react';
import { Pinwheel } from './Pinwheel';

export function PatternField({
  psize = 26,
  pgap = 30,
  pbase = 'rgba(244,241,235,0.07)',
  paccent = '#E2553A',
}: {
  psize?: number;
  pgap?: number;
  pbase?: string;
  paccent?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const builtRef = useRef(false);

  function buildPattern() {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';
    const step = psize + pgap;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const isAccent = idx % 11 === 5;
        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.left = `${c * step}px`;
        span.style.top = `${r * step}px`;
        span.style.lineHeight = '0';
        // We can't render React inside vanilla DOM directly, so we use an inline SVG string
        const color = isAccent ? pbase : pbase;
        const accent = isAccent ? paccent : pbase;
        span.innerHTML = `<svg viewBox="0 0 100 100" width="${psize}" height="${psize}" aria-hidden="true">
          <rect x="48" y="8" width="20" height="30" rx="3" fill="${color}" />
          <rect x="62" y="48" width="30" height="20" rx="3" fill="${color}" />
          <rect x="32" y="62" width="20" height="30" rx="3" fill="${color}" />
          <rect x="8" y="32" width="30" height="20" rx="3" fill="${color}" />
          <rect x="42" y="42" width="16" height="16" rx="2" fill="${accent}" />
        </svg>`;
        el.appendChild(span);
      }
    }
    builtRef.current = true;
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(timeout);
      timeout = setTimeout(buildPattern, 180);
    }
    buildPattern();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psize, pgap, pbase, paccent]);

  return (
    <div
      ref={containerRef}
      className="pattern-fill"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}

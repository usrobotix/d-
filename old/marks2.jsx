// marks2.jsx — finalist families: Aperture (×4) and d-fuse (×4)
// Each mark: (size, color, accent, style). Exported to window.

/* ============== APERTURE FAMILY ============== */

function ApPixel({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="40" y="8"  width="20" height="28" rx="3" fill={color} />
      <rect x="40" y="64" width="20" height="28" rx="3" fill={color} />
      <rect x="8"  y="40" width="28" height="20" rx="3" fill={color} />
      <rect x="64" y="40" width="28" height="20" rx="3" fill={color} />
      <rect x="42" y="42" width="16" height="16" rx="2" fill={accent} />
    </svg>
  );
}

function ApOpen({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="40" y="8"  width="20" height="29" rx="3" fill={color} />
      <rect x="40" y="63" width="20" height="29" rx="3" fill={color} />
      <rect x="8"  y="40" width="29" height="20" rx="3" fill={color} />
      <rect x="63" y="40" width="29" height="20" rx="3" fill={color} />
      <rect x="41.5" y="41.5" width="17" height="17" rx="2" fill="none" stroke={accent} strokeWidth="4" />
    </svg>
  );
}

function ApMotion({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="48" y="8"  width="20" height="30" rx="3" fill={color} />
      <rect x="62" y="48" width="30" height="20" rx="3" fill={color} />
      <rect x="32" y="62" width="20" height="30" rx="3" fill={color} />
      <rect x="8"  y="32" width="30" height="20" rx="3" fill={color} />
      <rect x="42" y="42" width="16" height="16" rx="2" fill={accent} />
    </svg>
  );
}

function ApData({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="40" y="8"  width="20" height="11" rx="2" fill={color} />
      <rect x="40" y="23" width="20" height="11" rx="2" fill={color} />
      <rect x="40" y="66" width="20" height="11" rx="2" fill={color} />
      <rect x="40" y="81" width="20" height="11" rx="2" fill={color} />
      <rect x="8"  y="40" width="11" height="20" rx="2" fill={color} />
      <rect x="23" y="40" width="11" height="20" rx="2" fill={color} />
      <rect x="66" y="40" width="11" height="20" rx="2" fill={color} />
      <rect x="81" y="40" width="11" height="20" rx="2" fill={color} />
      <rect x="42" y="42" width="16" height="16" rx="2" fill={accent} />
    </svg>
  );
}

/* ============== d-FUSE FAMILY ============== */

function DCross({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <circle cx="40" cy="66" r="24" fill="none" stroke={color} strokeWidth="16" />
      <rect x="58" y="6" width="16" height="84" rx="3" fill={color} />
      <rect x="50" y="24" width="40" height="14" rx="3" fill={accent} />
    </svg>
  );
}

function DCounter({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="58" y="6" width="16" height="84" rx="3" fill={color} />
      <circle cx="40" cy="66" r="31" fill={color} />
      <rect x="34" y="50" width="12" height="33" rx="1.5" fill={accent} />
      <rect x="23" y="60" width="34" height="12" rx="1.5" fill={accent} />
    </svg>
  );
}

function DPlusBowl({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="58" y="6" width="16" height="84" rx="3" fill={color} />
      <rect x="32" y="44" width="12" height="40" rx="3" fill={color} />
      <rect x="14" y="58" width="46" height="12" rx="3" fill={color} />
      <rect x="33" y="59" width="10" height="10" rx="2" fill={accent} />
    </svg>
  );
}

function DBlock({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="20" y="50" width="40" height="40" rx="6" fill="none" stroke={color} strokeWidth="14" />
      <rect x="60" y="10" width="14" height="80" rx="3" fill={color} />
      <rect x="50" y="20" width="40" height="14" rx="3" fill={accent} />
    </svg>
  );
}

Object.assign(window, {
  ApPixel, ApOpen, ApMotion, ApData,
  DCross, DCounter, DPlusBowl, DBlock,
});

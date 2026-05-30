// marks.jsx — candidate "+" marks for Диджитал плюс
// Each: (size, color, accent, style). Exported to window.

function MarkSplit({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="38" y="8" width="24" height="84" rx="3" fill={color} />
      <rect x="8" y="38" width="84" height="24" rx="3" fill={accent} />
    </svg>
  );
}

function MarkAperture({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <rect x="40" y="8"  width="20" height="30" rx="3" fill={color} />
      <rect x="40" y="62" width="20" height="30" rx="3" fill={color} />
      <rect x="8"  y="40" width="30" height="20" rx="3" fill={color} />
      <rect x="62" y="40" width="30" height="20" rx="3" fill={color} />
      <rect x="42" y="42" width="16" height="16" rx="2" fill={accent} />
    </svg>
  );
}

function MarkForward({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  // bold plus with a chamfered top-right corner → motion / "forward"
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <path
        d="M38 8 L50 8 L62 20 L62 38 L92 38 L92 62 L62 62 L62 92 L38 92 L38 62 L8 62 L8 38 L38 38 Z"
        fill={color}
      />
      <rect x="62" y="38" width="24" height="24" fill={accent} opacity="0" />
    </svg>
  );
}

function MarkFuse({ size = 100, color = 'var(--ink)', accent = 'var(--accent)', style }) {
  // lowercase "d" whose stem doubles as the vertical of a "+"
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <circle cx="40" cy="64" r="26" fill="none" stroke={color} strokeWidth="14" />
      <rect x="60" y="6" width="14" height="84" rx="3" fill={color} />
      <rect x="52" y="26" width="40" height="14" rx="3" fill={accent} />
    </svg>
  );
}

Object.assign(window, { MarkSplit, MarkAperture, MarkForward, MarkFuse });

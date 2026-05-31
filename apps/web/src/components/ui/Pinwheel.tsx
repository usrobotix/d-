export function Pinwheel({
  size = 100,
  color = '#F4F1EB',
  accent = '#E2553A',
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <rect x="48" y="8"  width="20" height="30" rx="3" fill={color} />
      <rect x="62" y="48" width="30" height="20" rx="3" fill={color} />
      <rect x="32" y="62" width="20" height="30" rx="3" fill={color} />
      <rect x="8"  y="32" width="30" height="20" rx="3" fill={color} />
      <rect x="42" y="42" width="16" height="16" rx="2" fill={accent} />
    </svg>
  );
}

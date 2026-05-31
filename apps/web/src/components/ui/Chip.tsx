'use client';
export function Chip({ label, count, active, onClick }: { label: string; count?: number; active?: boolean; onClick?: () => void; }) {
  return (
    <button className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {label} {count !== undefined && <span className="cnt">{count}</span>}
    </button>
  );
}

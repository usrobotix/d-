export function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return <div className={`eyebrow${center ? ' center' : ''}`}>{children}</div>;
}

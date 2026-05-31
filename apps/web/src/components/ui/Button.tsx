import Link from 'next/link';
export function Button({ href, onClick, variant = 'ghost', children, className = '', type = 'button' }: {
  href?: string; onClick?: () => void; variant?: 'primary' | 'ghost'; children: React.ReactNode; className?: string; type?: 'button' | 'submit';
}) {
  const cls = `btn btn-${variant} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}

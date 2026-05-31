export function SectionHead({ eyebrow, title, desc, center }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={`section-head reveal${center ? ' center' : ''}`}>
      {eyebrow && <div className={`eyebrow${center ? ' center' : ''}`}>{eyebrow}</div>}
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

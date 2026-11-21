// A section: a small tracked label, then content.
export default function Section({ id, label, className, children }) {
  return (
    <section id={id} className={className}>
      <h2 className="label mono">{label}</h2>
      {children}
    </section>
  );
}

// Two-digit row number, e.g. 01.
export const Num = ({ i }) => <span className="num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>;

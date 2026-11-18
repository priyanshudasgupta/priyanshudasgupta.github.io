// Shared layout: sticky margin label on the left, content on the right.
export default function Section({ id, label, title, className, children }) {
  return (
    <section id={id} className={className}>
      <div className="wrap row">
        <div className="margin-label ui">{label}</div>
        <div>
          {title && <h2>{title}</h2>}
          {children}
        </div>
      </div>
    </section>
  );
}

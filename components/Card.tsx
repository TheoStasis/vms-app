export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="surface p-6">
      {title && <h3 className="card-title mb-5">{title}</h3>}
      {children}
    </div>
  );
}
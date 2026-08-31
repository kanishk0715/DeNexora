import { PageHeader } from '../../components/ui/Primitives';

export default function FacultyHubPage({
  title,
  kicker,
  items,
}: {
  title: string;
  kicker: string;
  items: { t: string; d: string }[];
}) {
  return (
    <div>
      <PageHeader kicker={kicker} title={title} subtitle="Faculty internships, FDPs and research collabs with industry and councils." />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(i => (
          <article key={i.t} className="card p-5">
            <h2 className="font-semibold text-forest-900">{i.t}</h2>
            <p className="mt-2 text-sm text-ink-500">{i.d}</p>
            <button type="button" className="btn-primary mt-4">
              Express interest
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

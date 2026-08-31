import { useState } from 'react';
import { PageHeader } from '../../components/ui/Primitives';
import { DEMO_OPPORTUNITIES } from '../../data/demo';

export default function IndustryOpportunitiesPage() {
  const [open, setOpen] = useState(false);
  const [posted, setPosted] = useState(false);

  return (
    <div>
      <PageHeader
        kicker="Industry requirement portal"
        title="Your AYUSH openings"
        subtitle="Tag required skills from the shared ontology so students can be scored fairly."
        actions={
          <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
            Post requirement
          </button>
        }
      />
      {posted && (
        <p className="mb-4 rounded-lg bg-forest-50 px-4 py-2 text-sm text-forest-800">
          Requirement published. Eligible students will see a match score within minutes.
        </p>
      )}
      {open && (
        <form
          className="card mb-6 grid gap-3 p-5 sm:grid-cols-2"
          onSubmit={e => {
            e.preventDefault();
            setOpen(false);
            setPosted(true);
          }}
        >
          <input className="input sm:col-span-2" required placeholder="Title e.g. Panchakarma intern" />
          <select className="input">
            <option>internship</option>
            <option>job</option>
          </select>
          <input className="input" placeholder="Location" />
          <input className="input sm:col-span-2" placeholder="Required skills (comma separated)" />
          <textarea className="input sm:col-span-2" rows={3} placeholder="Description and eligibility" />
          <div className="flex gap-2 sm:col-span-2">
            <button className="btn-primary" type="submit">
              Publish
            </button>
            <button className="btn-secondary" type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        {DEMO_OPPORTUNITIES.map(o => (
          <div key={o._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold text-forest-900">{o.title}</p>
              <p className="text-xs text-ink-500">
                {o.location} · {o.applicantCount} applicants · {o.numberOfPositions} seats
              </p>
            </div>
            <span className="text-xs font-semibold uppercase text-forest-700">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

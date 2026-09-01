import { useState } from 'react';
import { PageHeader, Modal, SkillChipPicker } from '../../components/ui/Primitives';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DEMO_OPPORTUNITIES, SKILL_ONTOLOGY } from '../../data/demo';
import { useToast } from '../../contexts/ToastContext';

const STEPS = ['Basics', 'Skills', 'Review'];

type Draft = {
  title: string;
  type: string;
  location: string;
  duration: string;
  seats: string;
  skills: string[];
  description: string;
};

const EMPTY: Draft = {
  title: '',
  type: 'internship',
  location: '',
  duration: '3 months',
  seats: '6',
  skills: [],
  description: '',
};

export default function IndustryOpportunitiesPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [confirm, setConfirm] = useState(false);
  const [extra, setExtra] = useState<{ title: string; location: string; seats: string } | null>(null);

  const reset = () => {
    setOpen(false);
    setStep(0);
    setDraft(EMPTY);
  };

  const nextOk =
    step === 0 ? draft.title.trim().length > 2 && draft.location.trim().length > 1 : step === 1 ? draft.skills.length > 0 : true;

  const publish = () => {
    setExtra({ title: draft.title, location: draft.location, seats: draft.seats });
    reset();
    toast('success', 'Requirement published. Eligible students will see a match score shortly.');
  };

  return (
    <div className="mx-auto max-w-5xl">
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
      <div className="space-y-3">
        {extra && (
          <div className="card-hover flex flex-wrap items-center justify-between gap-3 border-forest-200 p-5">
            <div>
              <p className="font-semibold text-ink-900">{extra.title}</p>
              <p className="mt-1 text-xs text-ink-500">
                {extra.location} · 0 applicants · {extra.seats} seats
              </p>
            </div>
            <span className="rounded-full bg-saffron-50 px-2.5 py-0.5 text-xs font-semibold uppercase text-saffron-700">Just posted</span>
          </div>
        )}
        {DEMO_OPPORTUNITIES.map(o => (
          <div key={o._id} className="card-hover flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold text-ink-900">{o.title}</p>
              <p className="mt-1 text-xs text-ink-500">
                {o.location} · {o.applicantCount} applicants · {o.numberOfPositions} seats
              </p>
            </div>
            <span className="rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-semibold uppercase text-forest-700">Active</span>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={reset}
        size="lg"
        kicker={`Step ${step + 1} of 3`}
        title="Post a requirement"
      >
        <div className="mb-5 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? 'bg-forest-600' : 'bg-cream-200'}`} />
              <p className={`mt-1.5 text-[11px] font-semibold ${i === step ? 'text-forest-800' : 'text-ink-500'}`}>{s}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input sm:col-span-2"
              required
              placeholder="Title e.g. Panchakarma intern"
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            />
            <select className="input" value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}>
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
            <input
              className="input"
              placeholder="Location"
              value={draft.location}
              onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Duration"
              value={draft.duration}
              onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Number of seats"
              value={draft.seats}
              onChange={e => setDraft(d => ({ ...d, seats: e.target.value }))}
            />
            <textarea
              className="input sm:col-span-2"
              rows={3}
              placeholder="Description and eligibility"
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-3 text-sm text-ink-500">Tap every skill that applies — you can select more than one. Students are scored only on tagged skills.</p>
            <SkillChipPicker options={SKILL_ONTOLOGY} selected={draft.skills} onChange={skills => setDraft(d => ({ ...d, skills }))} />
            {draft.skills.length > 0 && (
              <p className="mt-3 text-xs font-medium text-forest-700">{draft.skills.length} skill{draft.skills.length === 1 ? '' : 's'} selected</p>
            )}
          </div>
        )}

        {step === 2 && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-ink-500">Title</dt>
              <dd className="font-semibold text-ink-900">{draft.title}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-ink-500">Type</dt>
              <dd className="capitalize text-ink-900">{draft.type}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
              <dt className="text-ink-500">Location · duration · seats</dt>
              <dd className="text-ink-900">
                {draft.location} · {draft.duration} · {draft.seats}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">Skills</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {draft.skills.map(s => (
                  <span key={s} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <button type="button" className="btn-secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="btn-primary flex-1" disabled={!nextOk} onClick={() => setStep(s => s + 1)}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn-primary flex-1" onClick={() => setConfirm(true)}>
              Publish
            </button>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Publish this requirement?"
        body="Eligible students will see a match score within minutes. You can close the posting later from this list."
        confirmLabel="Publish now"
        onConfirm={publish}
      />
    </div>
  );
}

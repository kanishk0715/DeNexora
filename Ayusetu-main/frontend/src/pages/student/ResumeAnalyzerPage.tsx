import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileScan, Upload, Sparkles } from 'lucide-react';
import { PageHeader, MatchBar } from '../../components/ui/Primitives';
import { useToast } from '../../contexts/ToastContext';
import { BAMS_SUBJECTS } from '../../data/ayurvedaBank';

const SAMPLE = {
  name: 'Ananya Sharma',
  stream: 'BAMS',
  institute: 'National Institute of Ayurveda, Jaipur',
  skills: [
    { name: 'Kayachikitsa', score: 82 },
    { name: 'Panchakarma', score: 74 },
    { name: 'Dravyaguna', score: 68 },
    { name: 'Clinical documentation', score: 51 },
  ],
  missing: ['Shalya Tantra hours', 'CCRAS case log', 'Nadi Pariksha attestation'],
  match: 79,
};

export default function ResumeAnalyzerPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<typeof SAMPLE | null>(null);

  const analyze = async (picked: File) => {
    setFile(picked);
    setBusy(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 900));
    setResult(SAMPLE);
    setBusy(false);
    toast('success', 'Resume mapped against the AYUSH skill ontology.');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Student workspace"
        title="Resume analyzer"
        subtitle="Upload a CV. AyuSetu extracts AYUSH subjects, flags gaps, and ranks fit against live internships."
      />

      <label className="card flex cursor-pointer flex-col items-center gap-3 border-dashed p-10 text-center transition hover:border-forest-300 hover:bg-forest-50/40">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-700">
          <Upload size={22} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink-900">Drop PDF or Word resume</span>
          <span className="mt-1 block text-xs text-ink-500">Prototype reads locally — nothing is sent to a hospital until you apply with DPDP consent.</span>
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="sr-only"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) void analyze(f);
          }}
        />
        {file && <span className="text-xs font-medium text-forest-800">{file.name}</span>}
      </label>

      {busy && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-forest-700">
          <Sparkles size={16} className="animate-pulse" /> Mapping clinical hours, subjects and certificates…
        </p>
      )}

      {result && (
        <div className="mt-6 grid gap-4">
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <FileScan size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Detected profile</p>
                <h2 className="mt-1 font-serif text-xl font-semibold text-ink-900">{result.name}</h2>
                <p className="text-sm text-ink-500">
                  {result.stream} · {result.institute}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <MatchBar score={result.match} />
              <p className="mt-1 text-xs text-ink-500">Fit vs current internship demand</p>
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Subjects on the CV</p>
            <ul className="mt-4 space-y-4">
              {result.skills.map(s => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="font-semibold text-forest-800">{s.score}</span>
                  </div>
                  <MatchBar score={s.score} />
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-saffron-700">Gaps to close</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              {result.missing.map(m => (
                <li key={m} className="rounded-xl bg-saffron-50 px-4 py-2">
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-500">Suggested BAMS papers if you have not assessed them yet:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BAMS_SUBJECTS.slice(0, 4).map(s => (
                <span key={s.id} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-forest-800">
                  {s.label}
                </span>
              ))}
            </div>
            <Link to="/assessment" className="btn-primary mt-5">
              Open subject assessment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

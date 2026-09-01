import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Printer, QrCode, Share2 } from 'lucide-react';
import { PageHeader, MatchBar, Modal } from '../../components/ui/Primitives';
import { DEMO_SKILLS } from '../../data/demo';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function PortfolioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);
  const url = useMemo(() => `${window.location.origin}/p/ananya-sharma`, []);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast('success', 'Public link copied');
    } catch {
      toast('error', 'Could not copy — select the URL instead.');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AyuSetu profile — Ananya Sharma', text: 'Verified AYUSH skill profile', url });
        toast('success', 'Share sheet opened');
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }
    setShareOpen(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Verified credential layer"
        title="Digital AYUSH profile"
        subtitle="Share a public link or QR. Unverified items stay hidden unless you opt in."
        actions={
          <div className="flex flex-wrap gap-2 no-print">
            <button type="button" className="btn-secondary" onClick={share}>
              <Share2 size={16} /> Share
            </button>
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print / PDF
            </button>
            <Link to="/p/ananya-sharma" className="btn-primary">
              Public view
            </Link>
          </div>
        }
      />

      <div className="print-area overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col gap-6 bg-forest-800 px-8 py-8 text-cream-50 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-saffron-300">AyuSetu verified profile</p>
            <h2 className="mt-2 text-3xl font-bold">{user?.name}</h2>
            <p className="mt-1 text-sm text-cream-200">BAMS · National Institute of Ayurveda, Jaipur · Cohort 2026</p>
            <p className="mt-4 font-mono text-sm text-saffron-300">ayusetu.app/p/ananya-sharma</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white p-2">
            <img src={qr} alt="QR code for public portfolio" width={120} height={120} className="h-[120px] w-[120px]" />
            <p className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-forest-800">
              <QrCode size={12} /> Scan
            </p>
          </div>
        </div>
        <div className="grid gap-8 px-8 py-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-ink-900">Skills</h3>
            <ul className="mt-4 space-y-4">
              {DEMO_SKILLS.map(s => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className={s.verified ? 'text-forest-700' : 'text-ink-500'}>
                      {s.score} {s.verified ? '· verified' : '· pending'}
                    </span>
                  </div>
                  <MatchBar score={s.score} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">Clinical exposure</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              {[
                { t: 'Panchakarma theatre observership — AIIA (120 hrs)', v: true },
                { t: 'Community yoga NCD camp — MDNIY', v: true },
                { t: 'Self-declared: Ayurveda dietetics workshop', v: false },
              ].map(x => (
                <li key={x.t} className="rounded-xl border border-slate-100 bg-cream-100 px-4 py-3">
                  <p>{x.t}</p>
                  <p className={`mt-1 text-xs font-semibold ${x.v ? 'text-forest-700' : 'text-ink-500'}`}>
                    {x.v ? 'Verified · shown publicly' : 'Pending · hidden on public view'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="border-t border-slate-100 px-8 py-4 text-xs text-ink-500">
          Ministry of AYUSH skill bridge · DPDP consent recorded · Unverified items omitted on the public URL
        </p>
      </div>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} kicker="Share" title="Send this profile">
        <p className="text-sm text-ink-500">{url}</p>
        <div className="mt-4 grid gap-2">
          <button type="button" className="btn-primary" onClick={copy}>
            Copy link
          </button>
          <a
            className="btn-secondary"
            href={`https://wa.me/?text=${encodeURIComponent(`AyuSetu verified profile: ${url}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a className="btn-secondary" href={`mailto:?subject=AyuSetu profile&body=${encodeURIComponent(url)}`}>
            <Mail size={16} /> Email
          </a>
        </div>
      </Modal>
    </div>
  );
}

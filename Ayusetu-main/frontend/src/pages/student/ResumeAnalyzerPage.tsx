import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileScan, Upload, Sparkles, Brain, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader, MatchBar } from '../../components/ui/Primitives';
import { useToast } from '../../contexts/ToastContext';
import { BAMS_SUBJECTS } from '../../data/ayurvedaBank';
import {
  extractResumeSkills,
  getSkillRelationships,
  type ResumeExtractionResult,
  type SemanticSkillMatch,
} from '../../lib/api';
import { DEMO_SKILLS, SKILL_ONTOLOGY } from '../../data/demo';

// Skills relevant to this platform's ontology
const PLATFORM_SKILLS = SKILL_ONTOLOGY ?? DEMO_SKILLS.map(s => s.name);

function confidenceColor(c: number) {
  if (c >= 0.85) return 'bg-forest-50 text-forest-800';
  if (c >= 0.70) return 'bg-cream-200 text-ink-800';
  return 'bg-saffron-50 text-saffron-700';
}

export default function ResumeAnalyzerPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResumeExtractionResult | null>(null);
  const [related, setRelated] = useState<Record<string, SemanticSkillMatch[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const analyze = async (picked: File) => {
    setFile(picked);
    setBusy(true);
    setResult(null);
    setRelated({});

    try {
      const data = await extractResumeSkills(picked, true, 0.65);
      setResult(data);

      // For first 3 skills, fetch related skills for gap guidance
      const topSkills = data.extracted_skills.slice(0, 3);
      const relMap: Record<string, SemanticSkillMatch[]> = {};
      await Promise.all(
        topSkills.map(async skill => {
          const rels = await getSkillRelationships(skill, PLATFORM_SKILLS, 4);
          if (rels.length > 0) relMap[skill] = rels;
        })
      );
      setRelated(relMap);

      const method = data.method === 'semantic+keyword' ? 'semantic + keyword' : data.method;
      toast('success', `Extracted ${data.count} skills via ${method} matching.`);
    } catch {
      toast('error', 'Could not reach the AI service. Try again or run the AI service locally.');
    } finally {
      setBusy(false);
    }
  };

  // Normalise a 0–1 confidence to 0–100 for the MatchBar
  const pct = (v: number) => Math.round(v * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Student workspace"
        title="Resume analyzer"
        subtitle="Upload a CV. AyuSetu uses NLP embeddings to extract AYUSH skills, flag gaps, and rank fit against live internships."
      />

      {/* Upload area */}
      <label className="card flex cursor-pointer flex-col items-center gap-3 border-dashed p-10 text-center transition hover:border-forest-300 hover:bg-forest-50/40">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-700">
          <Upload size={22} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink-900">Drop PDF or Word resume</span>
          <span className="mt-1 block text-xs text-ink-500">
            Skills are extracted locally via NLP embeddings — nothing is shared until you apply with DPDP consent.
          </span>
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

      {/* Loading */}
      {busy && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-forest-700">
          <Brain size={16} className="animate-pulse" /> Running semantic skill extraction…
        </p>
      )}

      {result && (
        <div className="mt-6 grid gap-4">

          {/* Method badge + count */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-800">
              <Sparkles size={12} />
              {result.method === 'semantic+keyword' ? 'Semantic + keyword' : result.method}
            </span>
            <span className="text-xs text-ink-500">{result.count} skills found</span>
            {result.semantic_error && (
              <span className="inline-flex items-center gap-1 rounded-full bg-saffron-50 px-3 py-1 text-xs text-saffron-700">
                <AlertCircle size={12} /> Semantic fallback: {result.fallback}
              </span>
            )}
          </div>

          {/* Extracted skills grid */}
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <FileScan size={16} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">Skills on your CV</p>
            </div>

            {/* Semantic details with confidence */}
            {result.semantic_details && result.semantic_details.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {result.semantic_details.map(detail => (
                  <li key={detail.skill}>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpanded(expanded === detail.skill ? null : detail.skill)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="shrink-0 text-forest-600" />
                          <span className="text-sm font-medium text-ink-900">{detail.skill}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${confidenceColor(detail.confidence)}`}>
                            {pct(detail.confidence)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 pl-6">
                        <MatchBar score={pct(detail.confidence)} />
                      </div>
                    </button>

                    {/* Context snippet */}
                    {expanded === detail.skill && detail.context && (
                      <p className="mt-2 pl-6 text-xs italic text-ink-500">
                        "…{detail.context}…"
                      </p>
                    )}

                    {/* Related skills */}
                    {related[detail.skill] && related[detail.skill].length > 0 && (
                      <div className="mt-2 pl-6">
                        <p className="text-[11px] text-ink-400">Related skills to explore:</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {related[detail.skill].map(r => (
                            <span key={r.skill} className="rounded-full bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-forest-800">
                              {r.skill} · {pct(r.similarity)}%
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              // Fallback: plain chip list
              <div className="mt-4 flex flex-wrap gap-2">
                {result.extracted_skills.map(skill => (
                  <span key={skill} className="rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-forest-800">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills added via semantic-only detection */}
          {result.semantic_only && result.semantic_only.length > 0 && (
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">
                Discovered via semantic context (not keyword)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.semantic_only.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800">
                    <Brain size={11} /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gap recommendations */}
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-saffron-700">Suggested BAMS subjects to assess</p>
            <p className="mt-1 text-xs text-ink-500">
              Based on gaps vs platform skill ontology.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
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

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Keyboard } from 'lucide-react';
import { PageHeader, WorkspaceBack } from '../../components/ui/Primitives';
import { ReadinessRing } from '../../components/ui/ReadinessRing';
import { useToast } from '../../contexts/ToastContext';
import { loadOnboarding, loadAssessmentResult, saveAssessmentResult, clearAssessmentResult, questionsForSkills, type BankQuestion } from '../../data/ayurvedaBank';
import { fetchAssessmentFlags } from '../../lib/api';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function paperFromOnboarding(): { skills: string[]; stream: string; questions: BankQuestion[] } {
  const data = loadOnboarding();
  const answers = data.answers ?? {};
  const stream = typeof answers.stream === 'string' ? answers.stream : '';
  const skills = Array.isArray(answers.skill) ? answers.skill.slice(0, 3) : [];
  return { skills, stream, questions: questionsForSkills(skills) };
}

export default function AssessmentPage() {
  const { toast } = useToast();
  const paper = useMemo(() => paperFromOnboarding(), []);
  const questions = paper.questions;
  const saved = useMemo(() => loadAssessmentResult(paper.skills), [paper.skills]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() => saved?.answers ?? {});
  const [done, setDone] = useState(() => Boolean(saved?.done));
  const [seconds, setSeconds] = useState(180);
  const [locked, setLocked] = useState(false);
  const [nlpFlags, setNlpFlags] = useState<string[]>(() => saved?.nlpFlags ?? []);
  const lockRef = useRef(false);
  const q = questions[step];
  const pct = questions.length ? ((step + (answers[q?.id] !== undefined ? 0.35 : 0)) / questions.length) * 100 : 0;
  const urgent = seconds <= 60;

  const choose = (idx: number) => {
    if (!q || lockRef.current || done) return;
    lockRef.current = true;
    setLocked(true);
    setAnswers(a => ({ ...a, [q.id]: idx }));
    window.setTimeout(() => {
      if (step === questions.length - 1) {
        setDone(true);
        toast('success', 'Assessment scored. Skill map updated.');
      } else {
        setStep(s => s + 1);
        lockRef.current = false;
        setLocked(false);
      }
    }, 280);
  };

  useEffect(() => {
    if (done || questions.length === 0) return;
    const id = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [done, questions.length]);

  useEffect(() => {
    if (seconds === 0 && !done && questions.length > 0) {
      setDone(true);
      toast('info', 'Time is up — scoring from answers so far.');
    }
  }, [seconds, done, toast, questions.length]);

  useEffect(() => {
    if (!done) return;
    void fetchAssessmentFlags(
      questions.map(item => ({
        skill_name: item.skill,
        selected_option: answers[item.id],
        correct_answer: item.correct,
      })),
    ).then(d => {
      if (d?.flags?.length) setNlpFlags(d.flags);
    });
  }, [done, answers, questions]);

  useEffect(() => {
    if (!done) return;
    saveAssessmentResult({ skills: paper.skills, answers, done: true, nlpFlags });
  }, [done, answers, nlpFlags, paper.skills]);

  useEffect(() => {
    if (done || !q) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) return;
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined && q.options[idx] !== undefined) {
        e.preventDefault();
        choose(idx);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          kicker="Skill assessment"
          title="Choose subjects first"
          subtitle="Start as a student in any AYUSH stream and select up to 3 subjects. The paper is built only from those subjects — 10 questions each."
        />
        <div className="card p-6">
          <p className="text-sm text-ink-500">
            {paper.stream
              ? `No subjects selected for ${paper.stream}. Open Get started, pick your stream, then choose up to 3 specialties to assess.`
              : 'No subjects selected. Open Get started, choose Student, then pick up to 3 specialties to assess.'}
          </p>
          <Link to="/" className="btn-primary mt-5">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  const bySkill = paper.skills.map(skill => {
    const qs = questions.filter(x => x.skill === skill);
    const right = qs.filter(x => answers[x.id] === x.correct).length;
    const score = Math.round((right / qs.length) * 100);
    return { skill, score, right, total: qs.length };
  });
  const composite = Math.round(bySkill.reduce((s, r) => s + r.score, 0) / Math.max(1, bySkill.length));

  if (done) {
    return (
      <div className="mx-auto max-w-3xl">
        <WorkspaceBack fallback="/dashboard" label="Back to overview" />
        <PageHeader
          kicker={paper.stream ? `${paper.stream} subject assessment` : 'Subject assessment'}
          title="Profile updated"
          subtitle={`Scored ${paper.skills.join(', ')}. Gaps now drive internship ranking.`}
        />
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 sm:p-8">
          <ReadinessRing value={composite} label="Composite" />
          {nlpFlags.length > 0 && (
            <ul className="mt-4 space-y-1 text-xs text-saffron-700">
              {nlpFlags.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          <ul className="mt-6 space-y-3 text-sm">
            {bySkill.map(r => (
              <li
                key={r.skill}
                className={`flex justify-between gap-3 rounded-xl px-4 py-3 ${r.score < 70 ? 'bg-saffron-50' : 'bg-cream-100'}`}
              >
                <span>
                  {r.skill}
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {r.right}/{r.total} correct
                  </span>
                </span>
                <span className={`shrink-0 font-semibold ${r.score < 70 ? 'text-saffron-700' : 'text-forest-800'}`}>
                  {r.score}
                  {r.score < 70 ? ' · gap' : ''}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/skills" state={{ from: '/assessment' }} className="btn-primary">
              Open skill map
            </Link>
            <Link to="/opportunities" state={{ from: '/assessment' }} className="btn-secondary">
              See ranked internships
            </Link>
            <button
              type="button"
              className="text-sm font-semibold text-forest-800 hover:underline"
              onClick={() => {
                clearAssessmentResult();
                setDone(false);
                setAnswers({});
                setStep(0);
                setSeconds(180);
                setNlpFlags([]);
                lockRef.current = false;
                setLocked(false);
              }}
            >
              Retake assessment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        kicker={q.skill}
        title="Competency check"
        subtitle={`${paper.skills.join(' · ')} · ${questions.length} questions from the subjects you selected.`}
        actions={
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums ${
              urgent ? 'border-saffron-200 bg-saffron-50 text-saffron-700' : 'border-slate-200 bg-white text-forest-800'
            }`}
          >
            <Clock size={16} />
            {formatTime(seconds)}
          </div>
        }
      />
      <div className="mb-3 flex flex-wrap gap-1">
        {questions.map((item, i) => (
          <span
            key={item.id}
            className={`h-1.5 min-w-[8px] flex-1 rounded-full transition ${
              i < step ? 'bg-forest-600' : i === step ? 'bg-forest-400' : 'bg-white'
            }`}
          />
        ))}
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white">
        <div className="progress-line" style={{ width: `${Math.max(8, pct)}%` }} />
      </div>
      <div className="card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {q.skill} · Question {step + 1} of {questions.length}
          </p>
          <p className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-500">
            <Keyboard size={12} /> A–D · tap an option to continue
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <h2 className="mt-4 font-serif text-xl font-semibold text-ink-900">{q.text}</h2>
            <div className="mt-6 space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  disabled={locked}
                  onClick={() => choose(i)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                    answers[q.id] === i
                      ? 'border-forest-700 bg-forest-50 font-medium shadow-sm ring-2 ring-forest-700/20'
                      : 'border-slate-200 hover:border-forest-300 hover:bg-cream-50'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                      answers[q.id] === i ? 'bg-forest-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6">
          <button
            type="button"
            className="btn-secondary"
            disabled={step === 0 || locked}
            onClick={() => {
              lockRef.current = false;
              setLocked(false);
              setStep(s => s - 1);
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '../../components/ui/Primitives';
import { ReadinessRing } from '../../components/ui/ReadinessRing';
import { ASSESSMENT_QUESTIONS } from '../../data/demo';

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const q = ASSESSMENT_QUESTIONS[step];
  const pct = ((step + (answers[q?.id] !== undefined ? 0.35 : 0)) / ASSESSMENT_QUESTIONS.length) * 100;

  if (done) {
    return (
      <div>
        <PageHeader kicker="Skill assessment" title="Profile updated" subtitle="Scores written to your skill map. Gaps now drive internship ranking." />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg p-8">
          <ReadinessRing value={76} label="Composite" />
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex justify-between rounded-xl bg-cream-100 px-3 py-2"><span>Panchakarma protocols</span><span className="font-semibold">78</span></li>
            <li className="flex justify-between rounded-xl bg-cream-100 px-3 py-2"><span>Yoga therapy</span><span className="font-semibold">88</span></li>
            <li className="flex justify-between rounded-xl bg-saffron-50 px-3 py-2"><span>Clinical documentation</span><span className="font-semibold text-saffron-700">54 · gap</span></li>
          </ul>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Skill assessment"
        title="AYUSH competency check"
        subtitle="Tap an answer. Your progress bar fills as you move — results feed match scores."
      />
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
        <div className="progress-line" style={{ width: `${Math.max(8, pct)}%` }} />
      </div>
      <div className="card max-w-2xl overflow-hidden p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          Question {step + 1} of {ASSESSMENT_QUESTIONS.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <h2 className="mt-3 font-serif text-xl text-forest-900">{q.text}</h2>
            <div className="mt-6 space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    answers[q.id] === i
                      ? 'border-forest-700 bg-forest-50 font-medium shadow-sm ring-2 ring-forest-700/20'
                      : 'border-stone-200 hover:border-forest-300 hover:bg-cream-50'
                  }`}
                >
                  <span className="mr-2 text-xs font-bold text-stone-400">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between">
          <button type="button" className="btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
            Back
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={answers[q.id] === undefined}
            onClick={() => {
              if (step === ASSESSMENT_QUESTIONS.length - 1) setDone(true);
              else setStep(s => s + 1);
            }}
          >
            {step === ASSESSMENT_QUESTIONS.length - 1 ? 'Submit & score' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

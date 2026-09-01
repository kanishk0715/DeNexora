import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, EmptyState } from '../../components/ui/Primitives';
import { useToast } from '../../contexts/ToastContext';
import { classifyResearchBlurbs } from '../../lib/api';

export default function FacultyHubPage({
  title,
  kicker,
  items,
}: {
  title: string;
  kicker: string;
  items: { t: string; d: string }[];
}) {
  const { toast, dismiss } = useToast();
  const [labels, setLabels] = useState<Record<string, string>>({});

  const express = async (name: string) => {
    const id = toast('loading', 'Recording interest…', 0);
    await new Promise(r => setTimeout(r, 600));
    dismiss(id);
    toast('success', `Interest recorded for “${name}”. The host will follow up.`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader kicker={kicker} title={title} subtitle="Faculty internships, FDPs and research collabs with industry and councils." />
      {items.length === 0 ? (
        <EmptyState title="No programmes listed" body="When councils publish a seat, it will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((i, idx) => (
            <motion.article
              key={i.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-hover p-5"
            >
              <h2 className="font-semibold text-ink-900">{i.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{i.d}</p>
              {labels[i.t] && <p className="mt-2 text-xs font-semibold text-forest-800">NLP topic: {labels[i.t]}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={() => express(i.t)}>
                  Express interest
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={async () => {
                      const r = await classifyResearchBlurbs(`${i.t}. ${i.d}`);
                      if (r?.label) {
                        setLabels(prev => ({ ...prev, [i.t]: r.label }));
                        toast('success', `Classified as ${r.label}`);
                      } else {
                        toast('info', 'Start the AI service on port 8000 to classify.');
                      }
                    }}
                  >
                    Classify
                  </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

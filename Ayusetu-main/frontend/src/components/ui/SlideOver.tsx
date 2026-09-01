import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export function SlideOver({
  open,
  onClose,
  title,
  kicker,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close panel" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="slideover-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-card"
            initial={{ x: 24, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                {kicker && <p className="text-xs font-semibold uppercase tracking-wide text-forest-600">{kicker}</p>}
                <h2 id="slideover-title" className="mt-1 text-lg font-bold text-ink-900">
                  {title}
                </h2>
              </div>
              <button type="button" className="rounded-lg p-1 text-ink-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && <div className="border-t border-slate-100 px-5 py-4">{footer}</div>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info' | 'loading';

type Toast = { id: number; kind: ToastKind; message: string };

interface ToastContextType {
  toast: (kind: ToastKind, message: string, ms?: number) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems(list => list.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, message: string, ms = 3200) => {
      const id = nextId++;
      setItems(list => [...list, { id, kind, message }]);
      if (kind !== 'loading' && ms > 0) {
        window.setTimeout(() => dismiss(id), ms);
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[70] flex w-[min(100%-2rem,22rem)] flex-col gap-2 lg:bottom-4">
        <AnimatePresence>
          {items.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              className="pointer-events-auto flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-card"
            >
              {t.kind === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-forest-600" />}
              {t.kind === 'error' && <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />}
              {t.kind === 'info' && <Info size={18} className="mt-0.5 shrink-0 text-forest-600" />}
              {t.kind === 'loading' && <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin text-forest-600" />}
              <p className="flex-1 text-ink-800">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

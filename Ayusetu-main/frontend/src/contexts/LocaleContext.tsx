import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isLang, langMeta, type Lang } from '../i18n/languages';

export type { Lang };

const STORAGE = 'ayusetu-lang';

interface LocaleContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE);
    return isLang(saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE, lang);
    const meta = langMeta(lang);
    document.documentElement.lang = meta.code;
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);

  return <LocaleContext.Provider value={{ lang, setLang }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}

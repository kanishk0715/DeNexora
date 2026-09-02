import { ChevronsUpDown } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { INTERFACE_LANGUAGES, type Lang } from '../../i18n/languages';

export function LanguageSelect({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { lang, setLang } = useLocale();
  const current = INTERFACE_LANGUAGES.find(l => l.code === lang) ?? INTERFACE_LANGUAGES[0];
  const dark = tone === 'dark';

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={e => setLang(e.target.value as Lang)}
        className={`max-w-[9.5rem] cursor-pointer appearance-none rounded-md border bg-transparent py-1.5 pl-2.5 pr-8 text-xs font-medium transition sm:max-w-[11rem] ${
          dark
            ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
            : 'border-forest-300/50 text-forest-800 hover:border-saffron-400 hover:bg-forest-800/5'
        }`}
        aria-label={`Language: ${current.native}`}
      >
        <option value="en">English</option>
        <optgroup label="Official languages of India">
          {INTERFACE_LANGUAGES.filter(l => l.code !== 'en').map(l => (
            <option key={l.code} value={l.code}>
              {l.native} ({l.name})
            </option>
          ))}
        </optgroup>
      </select>
      <ChevronsUpDown
        size={12}
        className={`pointer-events-none absolute right-2 ${dark ? 'text-white/70' : 'text-forest-700/70'}`}
        aria-hidden
      />
    </label>
  );
}

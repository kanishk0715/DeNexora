import { ChevronsUpDown } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { INTERFACE_LANGUAGES, type Lang } from '../../i18n/languages';

export function LanguageSelect() {
  const { lang, setLang } = useLocale();
  const current = INTERFACE_LANGUAGES.find(l => l.code === lang) ?? INTERFACE_LANGUAGES[0];

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={e => setLang(e.target.value as Lang)}
        className="max-w-[9.5rem] cursor-pointer appearance-none rounded-lg border border-[#e4f4ea] bg-white py-1.5 pl-2.5 pr-8 text-xs font-semibold text-[#0b5c3a] transition hover:bg-[#e8f3ee] sm:max-w-[11rem]"
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
      <ChevronsUpDown size={12} className="pointer-events-none absolute right-2 text-[#0b5c3a]/70" aria-hidden />
    </label>
  );
}

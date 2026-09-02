import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordField({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  required = true,
  autoComplete = 'current-password',
  placeholder,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          className="input pr-12"
          style={{ paddingRight: '2.75rem' }}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-forest-800 hover:bg-forest-50"
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          onClick={() => setShow(v => !v)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

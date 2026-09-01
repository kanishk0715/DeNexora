import { useEffect, useRef, useState } from 'react';

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStarted(true);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }
    let target = 0;
    let format: (n: number) => string;
    if (/k/i.test(value)) {
      target = parseFloat(value);
      const suffix = value.replace(/^[\d.]+/, '');
      format = n => `${Math.round(n)}${suffix}`;
    } else {
      target = Number(value.replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;
      format = n => (value.includes(',') ? Math.round(n).toLocaleString('en-IN') : String(Math.round(n)));
    }
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - (1 - p) ** 3;
      setShown(format(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

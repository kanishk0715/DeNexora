/** Official Indian flag: saffron #FF9933, white, India green #138808, chakra #000080. */
function AshokaChakra({ className = 'h-3 w-3' }: { className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12;
    const x1 = 12 + Math.cos(a) * 3.2;
    const y1 = 12 + Math.sin(a) * 3.2;
    const x2 = 12 + Math.cos(a) * 10;
    const y2 = 12 + Math.sin(a) * 10;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="1" />;
  });

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="11" fill="none" stroke="#000080" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.2" fill="#000080" />
      {spokes}
    </svg>
  );
}

/** Full-width flag: saffron on top, white + chakra, green below. */
export function TirangaBar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const tall = size === 'md';
  return (
    <div
      className={`relative flex w-full shrink-0 flex-col overflow-hidden ${tall ? 'h-3.5' : 'h-1.5'}`}
      role="img"
      aria-label="Indian national flag"
    >
      <span className="flex-1 bg-[#FF9933]" />
      <span className="relative flex flex-1 items-center justify-center bg-white">
        {tall && <AshokaChakra className="h-2.5 w-2.5" />}
      </span>
      <span className="flex-1 bg-[#138808]" />
    </div>
  );
}

/** Compact standing flag beside the emblem. */
export function TirangaMark({ className = 'h-9 w-[1.65rem]' }: { className?: string }) {
  return (
    <span
      className={`inline-flex overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/15 ${className}`}
      role="img"
      aria-label="Flag of India"
    >
      <span className="flex h-full w-full flex-col">
        <span className="flex-1 bg-[#FF9933]" />
        <span className="relative flex flex-1 items-center justify-center bg-white">
          <AshokaChakra className="h-2 w-2" />
        </span>
        <span className="flex-1 bg-[#138808]" />
      </span>
    </span>
  );
}

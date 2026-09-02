import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SacredLoadingAnimationProps {
  duration?: number;
  onComplete?: () => void;
}

type Theme = 'emerald' | 'gold' | 'copper';

export default function SacredLoadingAnimation({ 
  duration = 1800, 
  onComplete 
}: SacredLoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const [theme] = useState<Theme>('emerald');
  const [key] = useState(0);

  // Theme backgrounds
  const themeBackgrounds: Record<Theme, string> = {
    emerald: 'radial-gradient(circle at center, #1b4332 0%, #0d2818 45%, #05140d 100%)',
    gold: 'radial-gradient(circle at center, #5e4b10 0%, #2a2007 50%, #0d0a02 100%)',
    copper: 'radial-gradient(circle at center, #6b2d18 0%, #2e1208 50%, #100502 100%)',
  };

  // Progress timer
  useEffect(() => {
    const step = 30;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += step;
      const prog = Math.min(100, (elapsed / duration) * 100);
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      
      setProgress(prog);
      setTimeLeft(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    }, step);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: themeBackgrounds[theme] }}
    >
      {/* Sacred Geometry Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute h-[450px] w-[450px] rounded-full border border-dashed border-gold-400/20"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[40px] rounded-full border border-forest-400/15"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[90px] rounded-full border border-dashed border-gold-300/18"
          />
        </motion.div>
      </div>

      {/* Floating Prana Particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={`${key}-particle-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-forest-200 shadow-[0_0_10px_rgba(82,183,136,0.8)]"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 70 + 20}%`,
          }}
          animate={{
            y: [-80, 0],
            scale: [0.3, 1.2, 0.5],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-center px-4">
        {/* Sacred Lotus Mandala */}
        <div className="relative mb-6 flex h-[140px] w-[140px] items-center justify-center">
          {/* Glowing Halo */}
          <motion.div
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.6, 0.95, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-[170px] w-[170px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(82, 183, 136, 0.35) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 70%)',
            }}
          />

          {/* Lotus SVG */}
          <svg
            viewBox="0 0 200 200"
            className="relative z-10 h-[120px] w-[120px]"
            style={{ filter: 'drop-shadow(0 0 16px rgba(82, 183, 136, 0.6))' }}
          >
            {/* Central Golden Core */}
            <motion.circle
              cx="100"
              cy="100"
              initial={{ r: 12 }}
              animate={{ r: [12, 16, 12] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              fill="#e9c46a"
              style={{ filter: 'drop-shadow(0 0 12px #e9c46a)' }}
            />

            {/* 8 Blooming Petals */}
            <defs>
              <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52b788" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
              <linearGradient id="petalGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#74c69d" />
                <stop offset="100%" stopColor="#2d6a4f" />
              </linearGradient>
            </defs>

            {/* Main 4 Petals */}
            {[
              'M100,86 C90,50 110,50 100,20 C90,50 110,50 100,86 Z',
              'M114,100 C150,90 150,110 180,100 C150,90 150,110 114,100 Z',
              'M100,114 C90,150 110,150 100,180 C90,150 110,150 100,114 Z',
              'M86,100 C50,90 50,110 20,100 C50,90 50,110 86,100 Z',
            ].map((d, i) => (
              <motion.path
                key={`main-${i}`}
                d={d}
                fill="url(#petalGrad)"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.1 + 0.1,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{ transformOrigin: '100px 100px' }}
              />
            ))}

            {/* Diagonal 4 Petals */}
            {[
              'M110,90 C140,60 155,75 160,40 C130,50 120,70 110,90 Z',
              'M110,110 C140,140 155,125 160,160 C130,150 120,130 110,110 Z',
              'M90,110 C60,140 45,125 40,160 C70,150 80,130 90,110 Z',
              'M90,90 C60,60 45,75 40,40 C70,50 80,70 90,90 Z',
            ].map((d, i) => (
              <motion.path
                key={`diag-${i}`}
                d={d}
                fill="url(#petalGradLight)"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.1 + 0.5,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{ transformOrigin: '100px 100px' }}
              />
            ))}
          </svg>

          {/* Bursting Herbal Leaves */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { icon: '🌿', pos: 'top-[-10px] left-[60px]', delay: 0.4, dir: 'tl' },
              { icon: '🌱', pos: 'top-[60px] right-[-10px]', delay: 0.5, dir: 'tr' },
              { icon: '🌿', pos: 'bottom-[-10px] left-[60px]', delay: 0.6, dir: 'bl' },
              { icon: '🍃', pos: 'top-[60px] left-[-10px]', delay: 0.7, dir: 'tl' },
            ].map((leaf, i) => (
              <motion.div
                key={i}
                className={`absolute text-base ${leaf.pos}`}
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  x: leaf.dir === 'tr' ? 25 : -18,
                  y: leaf.dir.includes('t') ? -30 : -20,
                  rotate: leaf.dir === 'tr' ? -35 : 45,
                }}
                transition={{
                  duration: 1.8,
                  delay: leaf.delay,
                  ease: 'easeOut',
                }}
              >
                {leaf.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Block */}
        <div className="text-center">
          {/* Sanskrit Chant */}
          <motion.div
            animate={{
              opacity: [0.8, 1, 0.8],
              y: [0, -2, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1.5 font-serif text-sm tracking-widest text-gold-300"
            style={{ textShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
          >
            ॐ सर्वेषां स्वस्तिर्भवतु
          </motion.div>

          {/* Brand Title */}
          <h1
            className="mb-1.5 font-serif text-3xl font-black tracking-[4px]"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #b7e4c7 50%, #f3c969 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(82, 183, 136, 0.4)',
            }}
          >
            AYUSETU
          </h1>

          {/* Tagline */}
          <p className="mb-0.5 text-sm font-semibold text-forest-200">
            Ayurveda Graduate Internship & Career Ecosystem
          </p>

          {/* Subtext */}
          <p className="text-xs text-forest-300/75">
            Connecting BAMS & MD Ayurvedic Professionals with Premier Institutions
          </p>
        </div>

        {/* Progress Timer Bar */}
        <div className="mt-5 w-full max-w-[360px]">
          <div className="rounded-[16px] border border-forest-400/30 bg-[#081c15]/80 p-1 shadow-2xl backdrop-blur">
            <motion.div
              className="h-2 rounded-[10px]"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #52b788, #d4af37, #74c69d)',
                boxShadow: '0 0 12px rgba(82, 183, 136, 0.9)',
              }}
              transition={{ duration: 0.03, ease: 'linear' }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between px-2 text-xs text-forest-200">
            <span>
              Entering Sanctuary in <strong className="text-gold-300">{timeLeft.toFixed(1)}</strong>s
            </span>
            <span className="text-[10px] text-gold-300/75">
              <span className="mr-1">🔮</span>
              Loading...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

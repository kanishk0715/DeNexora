import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BadgeCheck, Lock } from 'lucide-react';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';

export function AuthFrame({
  children,
  kicker = 'Ministry of AYUSH · skill bridge',
  title = 'Clinical hours that hospitals can trust.',
  body = 'Institute-attested credentials, DPDP consent before sharing, and match scores against live internship demand.',
}: {
  children: ReactNode;
  kicker?: string;
  title?: string;
  body?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <SiteNav />
      <main className="flex flex-1">
        <aside className="relative hidden min-h-[28rem] w-[44%] overflow-hidden lg:block">
          <img src="/ayurveda-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/95 via-forest-900/70 to-forest-800/45" />
          <div className="relative flex h-full flex-col justify-end p-10 xl:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">{kicker}</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-snug text-white xl:text-4xl">{title}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">{body}</p>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-emerald-300" /> Verified skill layer, not a PDF dump
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-300" /> Explicit consent per organisation
              </li>
              <li className="flex items-center gap-2">
                <Lock size={16} className="text-emerald-300" /> Unverified items stay off the public score
              </li>
            </ul>
          </div>
        </aside>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

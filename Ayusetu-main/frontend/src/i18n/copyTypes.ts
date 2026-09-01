export type RoleCopy = { label: string; hint: string };

export type PublicCopy = {
  nav: Record<string, string>;
  footer: Record<string, string>;
  hero: Record<string, string>;
  stats: { n: string; l: string }[];
  partners: { kicker: string; title: string };
  audience: {
    kicker: string;
    title: string;
    subtitle: string;
    tabs: { id: string; label: string; heading: string; points: string[] }[];
  };
  how: { title: string; subtitle: string; steps: { t: string; b: string }[] };
  features: { title: string; subtitle: string; items: { t: string; b: string }[] };
  pathways: { title: string; body: string; points: string[]; sample: string };
  workspaces: { title: string; subtitle: string; start: string };
  modal: { kicker: string; choose: string; questions: string; help: string; then: string; back: string; continue: string };
  about: {
    kicker: string;
    title: string;
    lead: string;
    matchTitle: string;
    matchBody: string;
    matchPoints: string[];
    whoTitle: string;
    who: { t: string; b: string }[];
    trustTitle: string;
    trustBody: string;
  };
  roles: {
    student: RoleCopy;
    academician: RoleCopy;
    industry: RoleCopy;
    institution: RoleCopy;
    admin: RoleCopy;
  };
};

import type { PublicCopy } from './copyTypes';

export type CopyLists = {
  nav: [string, string, string, string, string, string, string, string];
  footer: [
    string, string, string, string, string, string, string, string, string, string, string, string, string,
  ];
  hero: [string, string, string, string, string, string, string];
  stats: [string, string, string, string];
  partners: [string, string];
  audience: [string, string, string];
  tabs: [
    [string, string, string, string, string],
    [string, string, string, string, string],
    [string, string, string, string, string],
  ];
  how: [string, string];
  steps: [[string, string], [string, string], [string, string], [string, string], [string, string]];
  features: [string, string];
  items: [[string, string], [string, string], [string, string], [string, string], [string, string]];
  pathways: [string, string, string, string, string, string];
  workspaces: [string, string, string];
  modal: [string, string, string, string, string, string, string];
  aboutHead: [string, string, string, string, string];
  matchPoints: [string, string, string, string];
  whoTitle: string;
  who: [[string, string], [string, string], [string, string], [string, string]];
  trust: [string, string];
  roles: [[string, string], [string, string], [string, string], [string, string], [string, string]];
};

export function buildCopy(d: CopyLists): PublicCopy {
  return {
    nav: {
      how: d.nav[0],
      forYou: d.nav[1],
      features: d.nav[2],
      about: d.nav[3],
      workspaces: d.nav[4],
      login: d.nav[5],
      getStarted: d.nav[6],
      openWorkspace: d.nav[7],
    },
    footer: {
      blurb: d.footer[0],
      platform: d.footer[1],
      getIn: d.footer[2],
      aligned: d.footer[3],
      login: d.footer[4],
      register: d.footer[5],
      portfolio: d.footer[6],
      about: d.footer[7],
      ministry: d.footer[8],
      institutes: d.footer[9],
      consent: d.footer[10],
      copyright: d.footer[11],
      sih: d.footer[12],
    },
    hero: {
      badge: d.hero[0],
      title: d.hero[1],
      body: d.hero[2],
      getStarted: d.hero[3],
      how: d.hero[4],
      consent: d.hero[5],
      verified: d.hero[6],
    },
    stats: [
      { n: '48k+', l: d.stats[0] },
      { n: '1,042', l: d.stats[1] },
      { n: '186', l: d.stats[2] },
      { n: '5', l: d.stats[3] },
    ],
    partners: { kicker: d.partners[0], title: d.partners[1] },
    audience: {
      kicker: d.audience[0],
      title: d.audience[1],
      subtitle: d.audience[2],
      tabs: [
        { id: 'students', label: d.tabs[0][0], heading: d.tabs[0][1], points: [d.tabs[0][2], d.tabs[0][3], d.tabs[0][4]] },
        { id: 'hospitals', label: d.tabs[1][0], heading: d.tabs[1][1], points: [d.tabs[1][2], d.tabs[1][3], d.tabs[1][4]] },
        { id: 'institutes', label: d.tabs[2][0], heading: d.tabs[2][1], points: [d.tabs[2][2], d.tabs[2][3], d.tabs[2][4]] },
      ],
    },
    how: {
      title: d.how[0],
      subtitle: d.how[1],
      steps: d.steps.map(([t, b]) => ({ t, b })),
    },
    features: {
      title: d.features[0],
      subtitle: d.features[1],
      items: d.items.map(([t, b]) => ({ t, b })),
    },
    pathways: {
      title: d.pathways[0],
      body: d.pathways[1],
      points: [d.pathways[2], d.pathways[3], d.pathways[4]],
      sample: d.pathways[5],
    },
    workspaces: { title: d.workspaces[0], subtitle: d.workspaces[1], start: d.workspaces[2] },
    modal: {
      kicker: d.modal[0],
      choose: d.modal[1],
      questions: d.modal[2],
      help: d.modal[3],
      then: d.modal[4],
      back: d.modal[5],
      continue: d.modal[6],
    },
    about: {
      kicker: d.aboutHead[0],
      title: d.aboutHead[1],
      lead: d.aboutHead[2],
      matchTitle: d.aboutHead[3],
      matchBody: d.aboutHead[4],
      matchPoints: [...d.matchPoints],
      whoTitle: d.whoTitle,
      who: d.who.map(([t, b]) => ({ t, b })),
      trustTitle: d.trust[0],
      trustBody: d.trust[1],
    },
    roles: {
      student: { label: d.roles[0][0], hint: d.roles[0][1] },
      academician: { label: d.roles[1][0], hint: d.roles[1][1] },
      industry: { label: d.roles[2][0], hint: d.roles[2][1] },
      institution: { label: d.roles[3][0], hint: d.roles[3][1] },
      admin: { label: d.roles[4][0], hint: d.roles[4][1] },
    },
  };
}

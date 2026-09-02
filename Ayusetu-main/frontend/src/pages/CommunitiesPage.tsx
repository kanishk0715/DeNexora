import { motion } from 'framer-motion';
import { 
  Users, 
  Newspaper, 
  TrendingUp, 
  MessageCircle, 
  Linkedin, 
  Twitter,
  Youtube,
  Globe,
  Building2,
  Stethoscope,
  GraduationCap,
  ExternalLink,
  Heart,
  Share2,
  BookOpen,
} from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Link } from 'react-router-dom';

const SOCIAL_PLATFORMS = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    handle: '@ayush-ministry',
    followers: '50K+',
    color: 'from-blue-600 to-blue-700',
    link: 'https://www.linkedin.com/company/ministry-of-ayush',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    handle: '@moayush',
    followers: '125K+',
    color: 'from-sky-500 to-sky-600',
    link: 'https://twitter.com/moayush',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    handle: '@MinistryofAYUSH',
    followers: '85K+',
    color: 'from-red-600 to-red-700',
    link: 'https://www.youtube.com/@MinistryofAYUSH',
  },
];

const TRENDING_TOPICS = [
  { tag: '#InternationalYogaDay', posts: '2.5M', trending: true, link: 'https://twitter.com/hashtag/InternationalYogaDay' },
  { tag: '#Ayurveda', posts: '1.8M', trending: true, link: 'https://twitter.com/hashtag/Ayurveda' },
  { tag: '#AYUSH', posts: '850K', trending: false, link: 'https://twitter.com/hashtag/AYUSH' },
  { tag: '#NaturalHealing', posts: '650K', trending: true, link: 'https://twitter.com/hashtag/NaturalHealing' },
  { tag: '#TraditionalMedicine', posts: '420K', trending: false, link: 'https://twitter.com/hashtag/TraditionalMedicine' },
  { tag: '#Panchakarma', posts: '185K', trending: false, link: 'https://twitter.com/hashtag/Panchakarma' },
];

const LATEST_NEWS = [
  {
    title: 'Ministry of AYUSH launches new internship program for BAMS students',
    source: 'PIB India',
    time: '2 hours ago',
    category: 'Education',
    link: 'https://pib.gov.in/indexd.aspx',
  },
  {
    title: 'AIIA Bangalore introduces advanced Panchakarma training module',
    source: 'AYUSH Portal',
    time: '5 hours ago',
    category: 'Training',
    link: 'https://www.ayush.gov.in/',
  },
  {
    title: 'National Ayurveda Day 2024: Theme and celebrations announced',
    source: 'Ministry of AYUSH',
    time: '1 day ago',
    category: 'Events',
    link: 'https://www.ayush.gov.in/',
  },
  {
    title: 'Kerala Ayurveda expands wellness centers across 15 cities',
    source: 'Healthcare Today',
    time: '2 days ago',
    category: 'Industry',
    link: 'https://www.keralaayurveda.biz/',
  },
];

const FEATURED_INSTITUTES = [
  {
    name: 'AIIA New Delhi',
    type: 'National Institute',
    members: '5,200+',
    icon: Building2,
    color: 'forest',
  },
  {
    name: 'NIA Jaipur',
    type: 'Ayurveda College',
    members: '3,800+',
    icon: GraduationCap,
    color: 'saffron',
  },
  {
    name: 'MDNIY Delhi',
    type: 'Yoga Institute',
    members: '2,400+',
    icon: Stethoscope,
    color: 'forest',
  },
  {
    name: 'CCRAS Research',
    type: 'Research Council',
    members: '1,900+',
    icon: BookOpen,
    color: 'saffron',
  },
];

const COMMUNITY_STATS = [
  { label: 'Active Members', value: '50,000+', icon: Users },
  { label: 'Daily Posts', value: '1,200+', icon: MessageCircle },
  { label: 'Institutes', value: '450+', icon: Building2 },
  { label: 'Success Stories', value: '2,800+', icon: Heart },
];

export default function CommunitiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-forest-50/30 via-white to-saffron-50/30">
      <SiteNav />

      <main className="flex-1">
        {/* Compact Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest-600 to-forest-800 py-12 text-white">
          <div className="absolute inset-0 bg-[url('/ayurveda-hero.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="relative mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-serif text-3xl font-bold sm:text-4xl">
                AYUSH Communities
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base text-forest-50">
                Connect with India's largest AYUSH network. Share knowledge, discover opportunities, stay updated.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Compact Stats Bar */}
        <section className="border-y border-forest-100 bg-white py-6">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {COMMUNITY_STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-forest-100 to-saffron-100">
                      <Icon className="text-forest-700" size={18} />
                    </div>
                    <p className="font-serif text-xl font-bold text-forest-700">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-ink-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trending & News Section */}
        <section className="bg-gradient-to-br from-forest-50/30 to-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Trending Topics */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-white">
                    <TrendingUp size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-ink-900">Trending Topics</h2>
                </div>
                <div className="space-y-2.5">
                  {TRENDING_TOPICS.map((topic, i) => (
                    <motion.a
                      key={topic.tag}
                      href={topic.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 transition hover:border-forest-300 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {topic.trending && (
                          <span className="flex h-2 w-2">
                            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-saffron-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-600"></span>
                          </span>
                        )}
                        <span className="text-sm font-semibold text-forest-700 hover:text-forest-800">{topic.tag}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-500">{topic.posts}</span>
                        <ExternalLink size={12} className="text-forest-600" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Latest News */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-700 text-white">
                    <Newspaper size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-ink-900">Latest News</h2>
                </div>
                <div className="space-y-3">
                  {LATEST_NEWS.map((news, i) => (
                    <motion.a
                      key={news.title}
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group block cursor-pointer rounded-lg border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-3 transition hover:border-forest-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
                          {news.category}
                        </span>
                        <span className="text-[10px] text-ink-500">{news.time}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-snug text-ink-900 group-hover:text-forest-700 flex-1">
                          {news.title}
                        </h3>
                        <ExternalLink size={14} className="shrink-0 text-forest-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1.5 text-[10px] text-ink-500">{news.source}</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Platforms - Moved After Trending/News */}
        <section className="border-y border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-ink-900">Connect on Social Media</h2>
              <p className="mt-2 text-sm text-ink-600">Follow us for daily updates and community highlights</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {SOCIAL_PLATFORMS.map((platform, i) => {
                const Icon = platform.icon;
                return (
                  <motion.a
                    key={platform.name}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${platform.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ink-900">{platform.name}</h3>
                    <p className="mt-1 text-xs text-ink-600">{platform.handle}</p>
                    <p className="mt-2 text-sm font-semibold text-forest-700">{platform.followers}</p>
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-forest-600">
                      Follow us <ExternalLink size={12} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Institutes */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-bold text-ink-900">Featured Institutes</h2>
              <p className="mt-2 text-ink-600">Connect with leading AYUSH institutions and their communities</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_INSTITUTES.map((institute, i) => {
                const Icon = institute.icon;
                return (
                  <motion.div
                    key={institute.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-center shadow-md transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl"
                  >
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${institute.color === 'forest' ? 'from-forest-100 to-forest-200' : 'from-saffron-100 to-saffron-200'} text-${institute.color}-700 transition-transform group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-ink-900">{institute.name}</h3>
                    <p className="mt-1 text-sm text-ink-600">{institute.type}</p>
                    <p className="mt-3 text-sm font-semibold text-forest-700">{institute.members} members</p>
                    <button className="mt-4 w-full rounded-lg bg-forest-600 py-2 text-sm font-semibold text-white transition hover:bg-forest-700">
                      Join Community
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-y-2 border-forest-200 bg-gradient-to-r from-forest-600 to-forest-700 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to join the community?</h2>
            <p className="mt-4 text-lg text-forest-50">
              Connect with thousands of AYUSH professionals, share your journey, and grow together.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-forest-700 transition hover:bg-forest-50"
              >
                Get Started
                <Share2 size={16} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

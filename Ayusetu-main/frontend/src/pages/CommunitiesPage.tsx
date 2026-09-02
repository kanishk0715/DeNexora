import { motion } from 'framer-motion';
import { 
  Users, 
  Newspaper, 
  MessageCircle, 
  Linkedin, 
  Twitter,
  Youtube,
  Building2,
  Stethoscope,
  GraduationCap,
  ExternalLink,
  Heart,
  Share2,
  BookOpen,
  Calendar,
  Award,
  Briefcase,
  FileText,
  Star,
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

const LATEST_NEWS = [
  {
    title: 'Ministry of AYUSH launches new internship program for BAMS students',
    source: 'PIB India',
    time: '2 hours ago',
    category: 'Education',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'AIIA Bangalore introduces advanced Panchakarma training module',
    source: 'AYUSH Portal',
    time: '5 hours ago',
    category: 'Training',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'National Ayurveda Day 2024: Theme and celebrations announced',
    source: 'Ministry of AYUSH',
    time: '1 day ago',
    category: 'Events',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'Kerala Ayurveda expands wellness centers across 15 cities',
    source: 'Healthcare Today',
    time: '2 days ago',
    category: 'Industry',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'CCRAS announces new research grants for Ayurveda scholars',
    source: 'CCRAS Official',
    time: '3 days ago',
    category: 'Research',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'All India AYUSH PG entrance exam dates released',
    source: 'AIAPGET',
    time: '4 days ago',
    category: 'Exams',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'New AYUSH wellness centers approved in 12 states across India',
    source: 'Health Ministry',
    time: '5 days ago',
    category: 'Infrastructure',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'International collaboration for traditional medicine research initiated',
    source: 'WHO & AYUSH',
    time: '1 week ago',
    category: 'Global',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'BAMS curriculum update: New clinical training modules introduced',
    source: 'NMC-AYUSH',
    time: '1 week ago',
    category: 'Education',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'Ayurveda hospitals report 40% increase in patient footfall nationwide',
    source: 'Healthcare India',
    time: '1 week ago',
    category: 'Healthcare',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'Government approves scholarships for 5000 AYUSH students',
    source: 'Ministry of AYUSH',
    time: '2 weeks ago',
    category: 'Education',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
  {
    title: 'New digital platform launched for Ayurveda telemedicine consultations',
    source: 'Health Tech News',
    time: '2 weeks ago',
    category: 'Technology',
    link: 'https://health.economictimes.indiatimes.com/tag/ayurveda',
  },
];

const UPCOMING_EVENTS = [
  {
    title: 'National Ayurveda Day Celebration',
    date: 'November 8, 2024',
    venue: 'All India Institute of Ayurveda, Delhi',
    type: 'Conference',
    attendees: '2000+',
  },
  {
    title: 'AYUSH Internship Fair 2024',
    date: 'December 15-16, 2024',
    venue: 'Virtual Event',
    type: 'Career Fair',
    attendees: '5000+',
  },
  {
    title: 'Panchakarma Workshop for Practitioners',
    date: 'January 20-22, 2025',
    venue: 'NIA Jaipur',
    type: 'Workshop',
    attendees: '300+',
  },
  {
    title: 'AYUSH Startup Summit',
    date: 'February 10, 2025',
    venue: 'Bangalore',
    type: 'Summit',
    attendees: '1000+',
  },
];

const SUCCESS_STORIES = [
  {
    name: 'Dr. Priya Sharma',
    role: 'BAMS Graduate',
    story: 'Secured position at AIIA after completing AyuSetu skill assessment',
    image: '👩‍⚕️',
    achievement: 'Placement at AIIA',
  },
  {
    name: 'Rahul Patel',
    role: 'Yoga Therapist',
    story: 'Started own wellness center with 50+ clients through platform networking',
    image: '🧘‍♂️',
    achievement: 'Entrepreneur',
  },
  {
    name: 'Dr. Anjali Verma',
    role: 'Research Scholar',
    story: 'Published 3 research papers with CCRAS collaboration found on AyuSetu',
    image: '👩‍🔬',
    achievement: 'Research Excellence',
  },
];

const RESOURCE_CATEGORIES = [
  {
    title: 'Study Materials',
    icon: BookOpen,
    count: '850+ Resources',
    description: 'BAMS notes, previous papers, reference books',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Career Guidance',
    icon: Briefcase,
    count: '200+ Guides',
    description: 'Interview tips, resume templates, career paths',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Research Papers',
    icon: BookOpen,
    count: '1200+ Papers',
    description: 'Latest Ayurveda research and clinical studies',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Video Tutorials',
    icon: Youtube,
    count: '500+ Videos',
    description: 'Panchakarma procedures, case studies, lectures',
    color: 'from-red-500 to-red-600',
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

        {/* Latest News Section */}
        <section className="bg-gradient-to-br from-forest-50/30 to-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-700 text-white">
                  <Newspaper size={18} />
                </div>
                <h2 className="text-xl font-bold text-ink-900">Latest News</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LATEST_NEWS.map((news, i) => (
                  <motion.a
                    key={news.title}
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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

        {/* Upcoming Events */}
        <section className="py-12 bg-gradient-to-br from-saffron-50/30 to-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-saffron-100 px-4 py-1.5 text-xs font-bold text-saffron-800">
                <Calendar size={14} />
                Don't Miss Out
              </div>
              <h2 className="mt-3 text-2xl font-bold text-ink-900">Upcoming Events</h2>
              <p className="mt-2 text-sm text-ink-600">Join workshops, conferences, and networking events</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {UPCOMING_EVENTS.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-saffron-100 px-2.5 py-1 text-xs font-bold text-saffron-700">
                      {event.type}
                    </span>
                    <Calendar size={16} className="text-saffron-600" />
                  </div>
                  <h3 className="text-sm font-bold text-ink-900 leading-snug">{event.title}</h3>
                  <p className="mt-2 text-xs text-forest-700 font-semibold">{event.date}</p>
                  <p className="mt-1 text-xs text-ink-600">{event.venue}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Users size={12} />
                      {event.attendees}
                    </span>
                    <button className="text-xs font-semibold text-forest-600 hover:text-forest-700">
                      Register →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="border-y border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-800">
                <Award size={14} />
                Community Success
              </div>
              <h2 className="mt-3 text-2xl font-bold text-ink-900">Success Stories</h2>
              <p className="mt-2 text-sm text-ink-600">Real achievements from our community members</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {SUCCESS_STORIES.map((story, i) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-forest-50/30 p-6 shadow-md transition hover:shadow-xl"
                >
                  <div className="mb-3 text-4xl">{story.image}</div>
                  <h3 className="font-bold text-ink-900">{story.name}</h3>
                  <p className="text-xs text-forest-700 font-semibold">{story.role}</p>
                  <p className="mt-3 text-sm text-ink-600 leading-relaxed">{story.story}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Star size={12} className="fill-green-700" />
                    {story.achievement}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Hub */}
        <section className="bg-gradient-to-br from-forest-50/30 to-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-800">
                <FileText size={14} />
                Learning Resources
              </div>
              <h2 className="mt-3 text-2xl font-bold text-ink-900">Resource Hub</h2>
              <p className="mt-2 text-sm text-ink-600">Access study materials, research papers, and tutorials</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {RESOURCE_CATEGORIES.map((resource, i) => {
                const Icon = resource.icon;
                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${resource.color} text-white transition-transform group-hover:scale-110`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-ink-900">{resource.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-forest-700">{resource.count}</p>
                    <p className="mt-2 text-xs text-ink-600 leading-relaxed">{resource.description}</p>
                    <button className="mt-4 text-xs font-semibold text-forest-600 hover:text-forest-700">
                      Browse →
                    </button>
                  </motion.div>
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

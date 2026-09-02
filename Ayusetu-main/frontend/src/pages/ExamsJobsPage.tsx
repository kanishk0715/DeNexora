import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, GraduationCap, Building2, ExternalLink, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import { SiteNav } from '../components/layout/SiteNav';
import { SiteFooter } from '../components/layout/SiteFooter';

type OpportunityType = 'exam' | 'job' | 'scheme' | 'internship';
type StreamType = 'BAMS' | 'BNYS' | 'BUMS' | 'BSMS' | 'BHMS' | 'All';
type StatusType = 'open' | 'closing-soon' | 'upcoming';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  stream: StreamType[];
  date: string;
  lastDate?: string;
  status: StatusType;
  link: string;
  eligibility?: string;
  description: string;
}

const SAMPLE_DATA: Opportunity[] = [
  {
    id: '1',
    title: 'AIAPGET 2025 - All India AYUSH Post Graduate Entrance Test',
    organization: 'National Testing Agency (NTA)',
    type: 'exam',
    stream: ['BAMS', 'BNYS', 'BUMS', 'BSMS', 'BHMS'],
    date: '2025-05-15',
    lastDate: '2025-03-20',
    status: 'open',
    link: 'https://ayush.nta.nic.in',
    eligibility: 'BAMS/BNYS/BUMS/BSMS/BHMS Graduate',
    description: 'National level entrance for MD/MS programs in AYUSH'
  },
  {
    id: '2',
    title: 'AYUSH Medical Officer Recruitment - UPSC',
    organization: 'Union Public Service Commission',
    type: 'job',
    stream: ['BAMS', 'BUMS', 'BHMS'],
    date: '2025-04-10',
    lastDate: '2025-02-28',
    status: 'closing-soon',
    link: 'https://upsc.gov.in',
    eligibility: 'BAMS/BUMS/BHMS with valid registration',
    description: '50 posts for Central Government Health Scheme'
  },
  {
    id: '3',
    title: 'CCRAS Research Fellowship Program 2025',
    organization: 'Central Council for Research in Ayurvedic Sciences',
    type: 'internship',
    stream: ['BAMS'],
    date: '2025-06-01',
    lastDate: '2025-04-15',
    status: 'open',
    link: 'https://ccras.nic.in',
    eligibility: 'MD (Ayu) or PhD pursuing students',
    description: '6-month paid fellowship in research institutes'
  },
  {
    id: '4',
    title: 'National AYUSH Mission - State Recruitment',
    organization: 'Ministry of AYUSH',
    type: 'job',
    stream: ['BAMS', 'BNYS', 'BUMS'],
    date: '2025-03-25',
    lastDate: '2025-02-10',
    status: 'closing-soon',
    link: 'https://ayush.gov.in',
    eligibility: 'BAMS/BNYS/BUMS Graduate with internship completion',
    description: 'Various positions across 15 states under NAM'
  },
  {
    id: '5',
    title: 'AIIMS Ayurveda Faculty Recruitment',
    organization: 'AIIMS Delhi',
    type: 'job',
    stream: ['BAMS'],
    date: '2025-07-01',
    lastDate: '2025-05-30',
    status: 'upcoming',
    link: 'https://aiimsexams.ac.in',
    eligibility: 'MD (Ayurveda) with teaching experience',
    description: 'Assistant Professor positions in various departments'
  },
  {
    id: '6',
    title: 'Post-Matric Scholarship for AYUSH Students',
    organization: 'Ministry of Social Justice',
    type: 'scheme',
    stream: ['All'],
    date: '2025-08-01',
    lastDate: '2025-10-31',
    status: 'upcoming',
    link: 'https://socialjustice.gov.in',
    eligibility: 'SC/ST/OBC students in AYUSH courses',
    description: 'Financial assistance for tuition and maintenance'
  }
];

const TYPE_ICONS = {
  exam: GraduationCap,
  job: Briefcase,
  scheme: Building2,
  internship: Calendar
};

const STATUS_COLORS = {
  open: 'bg-green-50 text-green-700 border-green-200',
  'closing-soon': 'bg-red-50 text-red-700 border-red-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200'
};

const STATUS_LABELS = {
  open: 'Open for Application',
  'closing-soon': 'Closing Soon',
  upcoming: 'Upcoming'
};

export default function ExamsJobsPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SAMPLE_DATA);
  const [filteredData, setFilteredData] = useState<Opportunity[]>(SAMPLE_DATA);
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>('all');
  const [streamFilter, setStreamFilter] = useState<StreamType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = opportunities;

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(opp => opp.type === typeFilter);
    }

    // Stream filter
    if (streamFilter !== 'All') {
      filtered = filtered.filter(opp => opp.stream.includes(streamFilter) || opp.stream.includes('All'));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [typeFilter, streamFilter, searchQuery, opportunities]);

  const calculateDaysLeft = (lastDate?: string) => {
    if (!lastDate) return null;
    const today = new Date();
    const deadline = new Date(lastDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <SiteNav />

      <main className="flex-1">
        {/* Header Section - Government Style */}
        <section className="border-b-4 border-orange-500 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="h-1 w-12 bg-orange-500"></div>
                <GraduationCap className="text-orange-400" size={32} />
                <div className="h-1 w-12 bg-orange-500"></div>
              </div>
              <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
                AYUSH Exams & Career Opportunities
              </h1>
              <p className="mt-4 text-lg text-blue-100">
                Government Examinations, Jobs, Internships & Scholarship Schemes
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
                <span className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Updated Daily
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {filteredData.length} Active Opportunities
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  <Search size={16} className="mb-1 inline" /> Search
                </label>
                <input
                  type="text"
                  placeholder="Search by title, organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  <Filter size={16} className="mb-1 inline" /> Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as OpportunityType | 'all')}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="exam">Exams</option>
                  <option value="job">Jobs</option>
                  <option value="internship">Internships</option>
                  <option value="scheme">Schemes</option>
                </select>
              </div>

              {/* Stream Filter */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  <GraduationCap size={16} className="mb-1 inline" /> Stream
                </label>
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value as StreamType)}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="All">All Streams</option>
                  <option value="BAMS">BAMS</option>
                  <option value="BNYS">BNYS</option>
                  <option value="BUMS">BUMS</option>
                  <option value="BSMS">BSMS</option>
                  <option value="BHMS">BHMS</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities List */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-semibold text-slate-600">No opportunities found</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting your filters</p>
              </div>
            ) : (
              filteredData.map((opp, index) => {
                const Icon = TYPE_ICONS[opp.type];
                const daysLeft = calculateDaysLeft(opp.lastDate);
                
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[opp.status]}`}>
                            <Clock size={12} />
                            {STATUS_LABELS[opp.status]}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <Icon size={12} />
                            {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                          </span>
                          {opp.stream.map(stream => (
                            <span key={stream} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                              {stream}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">
                          {opp.title}
                        </h3>
                        
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <Building2 size={14} />
                          {opp.organization}
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {opp.description}
                        </p>

                        {opp.eligibility && (
                          <p className="mt-2 text-xs text-slate-500">
                            <strong>Eligibility:</strong> {opp.eligibility}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                          {opp.date && (
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <Calendar size={14} className="text-slate-400" />
                              <strong>Exam/Event Date:</strong> {new Date(opp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="flex flex-col items-end gap-3 md:min-w-[200px]">
                        {daysLeft !== null && (
                          <div className={`rounded-lg border-2 p-3 text-center ${
                            daysLeft <= 7 ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
                          }`}>
                            <p className="text-2xl font-bold text-slate-900">{daysLeft}</p>
                            <p className="text-xs font-semibold text-slate-600">Days Left</p>
                            <p className="mt-1 text-[10px] text-slate-500">
                              Closes: {new Date(opp.lastDate!).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                        )}

                        <a
                          href={opp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                        >
                          Apply Now
                          <ExternalLink size={16} />
                        </a>

                        <button className="w-full rounded-lg border-2 border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                          Save for Later
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Info Banner */}
        <section className="border-t bg-gradient-to-r from-blue-50 to-green-50">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                💡 <strong>Note:</strong> Always verify details on official websites before applying. 
                We update this page daily with the latest AYUSH opportunities.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

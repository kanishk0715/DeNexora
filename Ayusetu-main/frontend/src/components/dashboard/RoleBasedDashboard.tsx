import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Building2, School, Shield, TrendingUp, FileText, CheckCircle, ArrowUpRight, Landmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_DASHBOARDS = {
  student: [
    { title: 'Skill assessment', value: 'Take test', icon: GraduationCap, link: '/assessment', description: 'Write scores into your skill map' },
    { title: 'Portfolio', value: 'View', icon: FileText, link: '/portfolio', description: 'Verified hours and certificates' },
    { title: 'Internships', value: 'Browse', icon: TrendingUp, link: '/opportunities', description: 'Gap-aware ranked matches' },
    { title: 'Exams & schemes', value: 'Open', icon: Landmark, link: '/exams-schemes', description: 'AIAPGET, NAM and scholarships' },
  ],
  academician: [
    { title: 'FDP programmes', value: 'Explore', icon: Users, link: '/faculty/fdp', description: 'Faculty development seats' },
    { title: 'Research', value: 'View', icon: FileText, link: '/faculty/research', description: 'Council collaborations' },
    { title: 'Internships', value: 'Apply', icon: Building2, link: '/faculty/internships', description: 'Industry exposure rotations' },
    { title: 'Opportunities', value: 'Browse', icon: TrendingUp, link: '/opportunities', description: 'Open AYUSH postings' },
  ],
  industry: [
    { title: 'Post a need', value: 'Create', icon: Building2, link: '/industry/opportunities', description: 'Jobs and internships' },
    { title: 'Applicants', value: 'Review', icon: FileText, link: '/industry/applications', description: 'Rank by match score' },
    { title: 'Training', value: 'Manage', icon: Users, link: '/industry/programs', description: 'Onboarding programmes' },
    { title: 'Overview', value: 'Pulse', icon: TrendingUp, link: '/dashboard', description: 'Recruitment funnel' },
  ],
  institution: [
    { title: 'Students', value: 'Manage', icon: School, link: '/institution/students', description: 'Verify credentials' },
    { title: 'Placements', value: 'Track', icon: CheckCircle, link: '/institution/placements', description: 'Offer pipeline' },
    { title: 'Analytics', value: 'View', icon: TrendingUp, link: '/institution/analytics', description: 'Demand vs supply' },
    { title: 'Overview', value: 'Pulse', icon: FileText, link: '/dashboard', description: 'Cohort snapshot' },
  ],
  admin: [
    { title: 'Directory', value: 'Manage', icon: Users, link: '/admin/users', description: 'Institutes and partners' },
    { title: 'Verifications', value: 'Review', icon: CheckCircle, link: '/admin/verifications', description: 'Pending authentications' },
    { title: 'Analytics', value: 'View', icon: TrendingUp, link: '/admin/analytics', description: 'National placement pulse' },
    { title: 'National view', value: 'Open', icon: Shield, link: '/dashboard', description: 'State-wise internships' },
  ],
} as const;

export function RoleBasedDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const widgets = ROLE_DASHBOARDS[user.role];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget, idx) => {
        const Icon = widget.icon;
        return (
          <motion.div
            key={widget.link + widget.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.28 }}
          >
            <Link to={widget.link} className="card-hover group flex h-full flex-col p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700 ring-1 ring-forest-100 transition group-hover:bg-forest-600 group-hover:text-white">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-semibold text-forest-700">{widget.value}</span>
              </div>
              <h3 className="flex items-center gap-1 text-base font-semibold text-ink-900">
                {widget.title}
                <ArrowUpRight size={14} className="text-forest-600 opacity-0 transition group-hover:opacity-100" />
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{widget.description}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

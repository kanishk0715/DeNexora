import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Users, Building2, School, Shield, TrendingUp, FileText, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardWidget {
  title: string;
  value: string | number;
  icon: any;
  link: string;
  color: string;
  description: string;
}

const ROLE_DASHBOARDS: Record<string, DashboardWidget[]> = {
  student: [
    {
      title: 'Skill Assessment',
      value: 'Take Test',
      icon: GraduationCap,
      link: '/assessment',
      color: 'bg-blue-500',
      description: 'Assess your Ayurveda skills',
    },
    {
      title: 'My Portfolio',
      value: 'View',
      icon: FileText,
      link: '/portfolio',
      color: 'bg-green-500',
      description: 'Showcase your achievements',
    },
    {
      title: 'Opportunities',
      value: 'Browse',
      icon: TrendingUp,
      link: '/opportunities',
      color: 'bg-orange-500',
      description: 'Find internships & jobs',
    },
    {
      title: 'Applications',
      value: 'Track',
      icon: CheckCircle,
      link: '/applications',
      color: 'bg-purple-500',
      description: 'Manage your applications',
    },
  ],
  academician: [
    {
      title: 'FDP Programs',
      value: 'Explore',
      icon: Users,
      link: '/faculty/fdp',
      color: 'bg-purple-500',
      description: 'Faculty development opportunities',
    },
    {
      title: 'Research',
      value: 'View',
      icon: FileText,
      link: '/faculty/research',
      color: 'bg-blue-500',
      description: 'Research collaborations',
    },
    {
      title: 'Internships',
      value: 'Apply',
      icon: Building2,
      link: '/faculty/internships',
      color: 'bg-green-500',
      description: 'Industry internships',
    },
    {
      title: 'Opportunities',
      value: 'Browse',
      icon: TrendingUp,
      link: '/opportunities',
      color: 'bg-orange-500',
      description: 'Professional opportunities',
    },
  ],
  industry: [
    {
      title: 'Post Opportunity',
      value: 'Create',
      icon: Building2,
      link: '/industry/opportunities',
      color: 'bg-orange-500',
      description: 'Post jobs & internships',
    },
    {
      title: 'Applications',
      value: 'Review',
      icon: FileText,
      link: '/industry/applications',
      color: 'bg-blue-500',
      description: 'Manage applicants',
    },
    {
      title: 'Training Programs',
      value: 'Manage',
      icon: Users,
      link: '/industry/programs',
      color: 'bg-purple-500',
      description: 'Training & development',
    },
    {
      title: 'Analytics',
      value: 'View',
      icon: TrendingUp,
      link: '/industry/analytics',
      color: 'bg-green-500',
      description: 'Recruitment insights',
    },
  ],
  institution: [
    {
      title: 'Student Analytics',
      value: 'View',
      icon: TrendingUp,
      link: '/institution/analytics',
      color: 'bg-green-500',
      description: 'Performance insights',
    },
    {
      title: 'Students',
      value: 'Manage',
      icon: Users,
      link: '/institution/students',
      color: 'bg-blue-500',
      description: 'Student management',
    },
    {
      title: 'Placements',
      value: 'Track',
      icon: CheckCircle,
      link: '/institution/placements',
      color: 'bg-purple-500',
      description: 'Placement tracking',
    },
    {
      title: 'Reports',
      value: 'Generate',
      icon: FileText,
      link: '/institution/reports',
      color: 'bg-orange-500',
      description: 'Generate reports',
    },
  ],
  admin: [
    {
      title: 'User Management',
      value: 'Manage',
      icon: Users,
      link: '/admin/users',
      color: 'bg-red-500',
      description: 'Manage all users',
    },
    {
      title: 'Verifications',
      value: 'Review',
      icon: CheckCircle,
      link: '/admin/verifications',
      color: 'bg-green-500',
      description: 'Approve verifications',
    },
    {
      title: 'Platform Analytics',
      value: 'View',
      icon: TrendingUp,
      link: '/admin/analytics',
      color: 'bg-blue-500',
      description: 'Platform insights',
    },
    {
      title: 'System Config',
      value: 'Configure',
      icon: Shield,
      link: '/admin/settings',
      color: 'bg-purple-500',
      description: 'System configuration',
    },
  ],
};

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const widgets = ROLE_DASHBOARDS[user.role] || [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget, idx) => {
        const Icon = widget.icon;
        return (
          <Link
            key={idx}
            to={widget.link}
            className="group rounded-xl border-2 border-gray-200 bg-white p-6 transition hover:border-[#0b5c3a] hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg ${widget.color} p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{widget.value}</span>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 group-hover:text-[#0b5c3a]">
              {widget.title}
            </h3>
            <p className="text-sm text-gray-600">{widget.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

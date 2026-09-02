import { Link } from 'react-router-dom';
import { SiteNav } from './layout/SiteNav';
import { SiteFooter } from './layout/SiteFooter';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Users, Building2, School, Shield } from 'lucide-react';

function StatusPage({
  code,
  title,
  body,
  action,
  extraContent,
}: {
  code: string;
  title: string;
  body: string;
  action: { to: string; label: string };
  extraContent?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-ink-900">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600">AyuSetu</p>
        <p className="mt-3 text-6xl font-bold text-forest-800">{code}</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">{body}</p>
        {extraContent}
        <Link to={action.to} className="btn-primary mt-8">
          {action.label}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ForbiddenPage() {
  const { user } = useAuth();

  const roleInfo: Record<string, { icon: any; color: string; bg: string; permissions: string[] }> = {
    student: {
      icon: GraduationCap,
      color: 'text-forest-700',
      bg: 'bg-forest-50',
      permissions: ['Skill Assessments', 'Portfolio Management', 'Apply to Opportunities', 'Track Applications'],
    },
    academician: {
      icon: Users,
      color: 'text-saffron-700',
      bg: 'bg-saffron-50',
      permissions: ['Faculty Development Programs', 'Research Collaborations', 'Industry Internships', 'View Opportunities'],
    },
    industry: {
      icon: Building2,
      color: 'text-copper-700',
      bg: 'bg-copper-50',
      permissions: ['Post Job Opportunities', 'Manage Applications', 'Training Programs', 'Recruitment Analytics'],
    },
    institution: {
      icon: School,
      color: 'text-forest-800',
      bg: 'bg-forest-100',
      permissions: ['Student Analytics', 'Placement Tracking', 'Performance Reports', 'Manage Students'],
    },
    admin: {
      icon: Shield,
      color: 'text-saffron-800',
      bg: 'bg-saffron-100',
      permissions: ['User Management', 'Platform Analytics', 'Verifications', 'System Configuration'],
    },
  };

  const currentRole = user?.role || 'student';
  const info = roleInfo[currentRole];
  const RoleIcon = info?.icon || Shield;

  return (
    <StatusPage
      code="403"
      title="Access Restricted"
      body="This section is for a different user role. Each role has specific permissions to maintain data security and privacy."
      action={{ to: '/dashboard', label: 'Back to your dashboard' }}
      extraContent={
        user && info ? (
          <div className={`mt-6 w-full max-w-md rounded-2xl border border-forest-200 ${info.bg} p-5 text-left shadow-sm`}>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-white p-2">
                <RoleIcon className={`h-5 w-5 ${info.color}`} />
              </div>
              <span className="font-semibold text-gray-900">
                Your Role: {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </span>
            </div>
            <div className="text-left text-sm text-gray-700">
              <p className="mb-2 font-medium">Your Permissions:</p>
              <ul className="space-y-1">
                {info.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-forest-700">✓</span>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null
      }
    />
  );
}

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="This page isn't on AyuSetu"
      body="The link may be outdated, or this path isn't part of the platform. Return home to match internships or open a workspace."
      action={{ to: '/', label: 'Back to home' }}
    />
  );
}

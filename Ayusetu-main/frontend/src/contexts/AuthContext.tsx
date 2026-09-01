import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/api';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isDemo: boolean;
  login: (email: string, password: string, allowedRoles?: User['role'][]) => Promise<void>;
  enterDemo: (role: User['role']) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PROFILES: Record<User['role'], User> = {
  student: {
    _id: 'demo-student',
    name: 'Ananya Sharma',
    email: 'ananya@nia.edu.in',
    role: 'student',
    isEmailVerified: true,
  },
  academician: {
    _id: 'demo-faculty',
    name: 'Dr. Suresh Kulkarni',
    email: 'suresh@aiia.gov.in',
    role: 'academician',
    isEmailVerified: true,
  },
  industry: {
    _id: 'demo-industry',
    name: 'Kavita Rao',
    email: 'talent@keralaayurveda.inc',
    role: 'industry',
    isEmailVerified: true,
  },
  institution: {
    _id: 'demo-institution',
    name: 'Registrar, NIA Jaipur',
    email: 'placement@nia.edu.in',
    role: 'institution',
    isEmailVerified: true,
  },
  admin: {
    _id: 'demo-admin',
    name: 'Ministry Analytics Cell',
    email: 'analytics@ayush.gov.in',
    role: 'admin',
    isEmailVerified: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isDemo, setIsDemo] = useState(localStorage.getItem('ayusetu-demo') === '1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoRole = localStorage.getItem('ayusetu-demo-role') as User['role'] | null;
    if (localStorage.getItem('ayusetu-demo') === '1' && demoRole && DEMO_PROFILES[demoRole]) {
      setUser(DEMO_PROFILES[demoRole]);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    if (token && token !== 'demo') {
      api
        .get('/auth/me')
        .then(res => {
          const u = res.data.data.user;
          setUser({
            _id: u.id || u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            isEmailVerified: u.isEmailVerified ?? true,
            profileImageUrl: u.profileImageUrl,
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const enterDemo = (role: User['role']) => {
    localStorage.setItem('ayusetu-demo', '1');
    localStorage.setItem('ayusetu-demo-role', role);
    localStorage.setItem('token', 'demo');
    setIsDemo(true);
    setToken('demo');
    setUser(DEMO_PROFILES[role]);
  };

  const login = async (email: string, password: string, allowedRoles?: User['role'][]) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: u } = res.data.data;
    if (allowedRoles?.length && !allowedRoles.includes(u.role)) {
      throw new Error('This account does not match this login. Use the portal for your role.');
    }
    localStorage.removeItem('ayusetu-demo');
    localStorage.removeItem('ayusetu-demo-role');
    localStorage.setItem('token', newToken);
    setIsDemo(false);
    setToken(newToken);
    setUser({
      _id: u.id || u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      isEmailVerified: true,
      profileImageUrl: u.profileImageUrl,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ayusetu-demo');
    localStorage.removeItem('ayusetu-demo-role');
    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isDemo, login, enterDemo, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

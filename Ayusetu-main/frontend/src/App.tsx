import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/student/AssessmentPage';
import SkillsPage from './pages/student/SkillsPage';
import OpportunitiesPage from './pages/student/OpportunitiesPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import ResumeAnalyzerPage from './pages/student/ResumeAnalyzerPage';
import PortfolioPage from './pages/student/PortfolioPage';
import ExamsSchemesPage from './pages/student/ExamsSchemesPage';
import IndustryOpportunitiesPage from './pages/industry/IndustryOpportunitiesPage';
import IndustryApplicantsPage from './pages/industry/IndustryApplicantsPage';
import IndustryProgramsPage from './pages/industry/IndustryProgramsPage';
import InstitutionAnalyticsPage from './pages/institution/InstitutionAnalyticsPage';
import InstitutionStudentsPage from './pages/institution/InstitutionStudentsPage';
import InstitutionPlacementsPage from './pages/institution/InstitutionPlacementsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';
import FacultyHubPage from './pages/faculty/FacultyHubPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import LoginPage from './pages/auth/LoginPage';
import RoleLoginPage from './pages/auth/RoleLoginPage';
import FacultyHospitalLogin from './pages/auth/FacultyHospitalLogin';
import InstituteMinistryLogin from './pages/auth/InstituteMinistryLogin';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/AboutPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ExamsJobsPage from './pages/ExamsJobsPage';
import { LocaleProvider } from './contexts/LocaleContext';
import { ToastProvider } from './contexts/ToastContext';
import { CommandPalette } from './components/CommandPalette';
import { ForbiddenPage, NotFoundPage } from './components/ErrorPages';
import { AyurvedaChatbot } from './components/AyurvedaChatbot';
import SacredLoadingAnimation from './components/SacredLoadingAnimation';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <AuthProvider>
      <LocaleProvider>
      <ToastProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          {showLoading && (
            <SacredLoadingAnimation 
              duration={1800} 
              onComplete={handleLoadingComplete}
            />
          )}
        </AnimatePresence>

        {!showLoading && (
          <>
            <CommandPalette />
            <AyurvedaChatbot />
            <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/exams-jobs" element={<ExamsJobsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/faculty-hospital" element={<FacultyHospitalLogin />} />
          <Route path="/login/institute-ministry" element={<InstituteMinistryLogin />} />
          <Route path="/login/:gate" element={<RoleLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/p/:slug" element={<PublicPortfolioPage />} />

          <Route path="/unauthorized" element={<ForbiddenPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AssessmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skills"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SkillsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opportunities"
              element={
                <ProtectedRoute allowedRoles={['student', 'academician']}>
                  <OpportunitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['student', 'academician']}>
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ResumeAnalyzerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams-schemes"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ExamsSchemesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/industry/opportunities"
              element={
                <ProtectedRoute allowedRoles={['industry']}>
                  <IndustryOpportunitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/industry/applications"
              element={
                <ProtectedRoute allowedRoles={['industry']}>
                  <IndustryApplicantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/industry/programs"
              element={
                <ProtectedRoute allowedRoles={['industry']}>
                  <IndustryProgramsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/analytics"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/students"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/placements"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionPlacementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminVerificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/internships"
              element={
                <ProtectedRoute allowedRoles={['academician']}>
                  <FacultyHubPage
                    kicker="Industry exposure"
                    title="Faculty internships"
                    items={[
                      { t: 'Wellness operations shadow', d: '4-week rotation with Kerala Ayurveda Ltd. quality and guest-care teams.' },
                      { t: 'CCRAS research attachment', d: 'Short-term training and guideship as per 2024 CCRAS guidelines.' },
                    ]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/fdp"
              element={
                <ProtectedRoute allowedRoles={['academician']}>
                  <FacultyHubPage
                    kicker="Faculty development"
                    title="FDP & workshops"
                    items={[
                      { t: 'Digital case documentation', d: 'Close the #1 industry skill gap in AYUSH hiring.' },
                      { t: 'AI-ready skill tagging', d: 'Train faculty to map courses to the AyuSetu ontology.' },
                    ]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/research"
              element={
                <ProtectedRoute allowedRoles={['academician']}>
                  <FacultyHubPage
                    kicker="Collaboration"
                    title="Research collaborations"
                    items={[
                      { t: 'Multi-centric Panchakarma outcomes', d: 'Joint protocol with AIIA and state pharmacies.' },
                      { t: 'Yoga NCD evidence cell', d: 'MDNIY + institute data-sharing under consent.' },
                    ]}
                  />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          </>
        )}
      </BrowserRouter>
      </ToastProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}

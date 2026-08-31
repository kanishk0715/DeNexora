import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center text-gray-600">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">403</p>
                <p className="mb-4">You don't have permission to access this page.</p>
                <a href="/dashboard" className="text-indigo-600 hover:underline text-sm">Go to dashboard</a>
              </div>
            </div>
          } />

          {/* Shared protected dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Student routes */}
          <Route path="/assessment" element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="p-8 text-gray-600">Assessment module — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="p-8 text-gray-600">Skill gaps — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/opportunities" element={
            <ProtectedRoute allowedRoles={['student', 'academician']}>
              <div className="p-8 text-gray-600">Opportunities — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['student', 'academician']}>
              <div className="p-8 text-gray-600">Applications tracker — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="p-8 text-gray-600">Portfolio — coming soon</div>
            </ProtectedRoute>
          } />

          {/* Industry routes */}
          <Route path="/industry/opportunities" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <div className="p-8 text-gray-600">Manage opportunities — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/industry/applications" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <div className="p-8 text-gray-600">Applicants — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/industry/programs" element={
            <ProtectedRoute allowedRoles={['industry']}>
              <div className="p-8 text-gray-600">Learning programs — coming soon</div>
            </ProtectedRoute>
          } />

          {/* Institution routes */}
          <Route path="/institution/analytics" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <div className="p-8 text-gray-600">Analytics — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/institution/students" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <div className="p-8 text-gray-600">Students — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/institution/placements" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <div className="p-8 text-gray-600">Placements — coming soon</div>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="p-8 text-gray-600">User management — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/verifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="p-8 text-gray-600">Verifications — coming soon</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="p-8 text-gray-600">Admin analytics — coming soon</div>
            </ProtectedRoute>
          } />

          {/* Public portfolio */}
          <Route path="/p/:slug" element={<div className="p-8 text-gray-600">Public portfolio — coming soon</div>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-gray-600">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">404</p>
                <p className="mb-4">Page not found.</p>
                <a href="/dashboard" className="text-indigo-600 hover:underline text-sm">Go to dashboard</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DSAPractice from './pages/DSAPractice';
import CodingPage from './pages/CodingPage';
import CompanyPage from './pages/CompanyPage';
import AdminPanel from './pages/AdminPanel';
import CompanySelection from './pages/CompanySelection';
import Resume from './pages/Resume';
import AICoach from './pages/AICoach';
import PersonalizedSheet from './pages/PersonalizedSheet';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

// Wrap children with Layout (sidebar) for all authenticated pages
function AuthenticatedLayout({ children }) {
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <Routes>
        {/* Public routes (no sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Authenticated routes (with sidebar) */}
        <Route path="/dashboard" element={
          <ProtectedRoute><AuthenticatedLayout><Dashboard /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><AuthenticatedLayout><Profile /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute><AuthenticatedLayout><Resume /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/coach" element={
          <ProtectedRoute><AuthenticatedLayout><AICoach /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/sheet" element={<ProtectedRoute><AuthenticatedLayout><PersonalizedSheet /></AuthenticatedLayout></ProtectedRoute>} />
        <Route path="/dsa" element={
          <ProtectedRoute><AuthenticatedLayout><DSAPractice /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/dsa/topic/:topicId" element={
          <ProtectedRoute><AuthenticatedLayout><DSAPractice /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/code/:questionId" element={
          <ProtectedRoute><AuthenticatedLayout><CodingPage /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute><AuthenticatedLayout><CompanySelection /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/companies/:id" element={
          <ProtectedRoute><AuthenticatedLayout><CompanyPage /></AuthenticatedLayout></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AuthenticatedLayout><AdminPanel /></AuthenticatedLayout></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

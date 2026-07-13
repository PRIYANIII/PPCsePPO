import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
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

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      {user && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        
        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        
        <Route path="/dsa" element={
          <ProtectedRoute><DSAPractice /></ProtectedRoute>
        } />
        
        <Route path="/dsa/topic/:topicId" element={
          <ProtectedRoute><DSAPractice /></ProtectedRoute>
        } />
        
        <Route path="/code/:questionId" element={
          <ProtectedRoute><CodingPage /></ProtectedRoute>
        } />
        
        <Route path="/companies" element={
          <ProtectedRoute><CompanySelection /></ProtectedRoute>
        } />
        
        <Route path="/companies/:id" element={
          <ProtectedRoute><CompanyPage /></ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <AdminRoute><AdminPanel /></AdminRoute>
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
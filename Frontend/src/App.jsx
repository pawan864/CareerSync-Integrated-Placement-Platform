/**
 * CareerSync Capstone Project
 * 
 * @module Frontend/App
 * @description Main application routing and context provider wrapper.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotificationTicker from './components/NotificationTicker';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Register from './pages/Register';
import Support from './pages/Support';
import Profile from './pages/Profile';
import SkillGap from './pages/SkillGap';
import JobBoard from './pages/JobBoard';
import EmployerDashboard from './pages/EmployerDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import PublicPortfolio from './pages/PublicPortfolio';

import InstitutionDashboard from './pages/InstitutionDashboard';
import ForgotPassword from './pages/ForgotPassword';
import GithubCallback from './pages/GithubCallback';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';

const AppContent = () => {
  const location = useLocation();
  const isPortfolioPage = location.pathname.startsWith('/portfolio/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/github/callback' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/support' || location.pathname === '/admin-login' || location.pathname === '/otp-verify' || location.pathname === '/student-dashboard' || location.pathname === '/admin-dashboard' || location.pathname === '/faculty-dashboard';
  const hideChrome = isAuthPage || isPortfolioPage;

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col w-full max-w-[100vw] overflow-x-hidden md:overflow-x-clip">
      {!hideChrome && <Navbar />}
      {!hideChrome && <NotificationTicker />}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/github/callback" element={<GithubCallback />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/support" element={<Support />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/portfolio/:slug" element={<PublicPortfolio />} />

          <Route path="/institution" element={<InstitutionDashboard />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;


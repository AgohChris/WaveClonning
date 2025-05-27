import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import SendMoneyPage from '@/pages/SendMoneyPage';
import RechargePage from '@/pages/RechargePage';
import OtpPage from '@/pages/OtpPage';
import SetPasswordPage from '@/pages/SetPasswordPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';

// Configure future flags for React Router v7
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function AppRoutes() {
  const { tempAuthData } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/otp" element={tempAuthData ? <OtpPage /> : <Navigate to="/auth" replace />} />
      <Route path="/set-password" element={tempAuthData?.otpVerified ? <SetPasswordPage /> : <Navigate to="/auth" replace />} />
      
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/send-money" element={<SendMoneyPage />} />
        <Route path="/recharge" element={<RechargePage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router {...routerOptions}>
        <div className="min-h-screen app-gradient-background">
          <AppRoutes />
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;

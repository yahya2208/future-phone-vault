import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Transactions from '@/pages/Transactions';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/AdminDashboard';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Disclaimer from '@/pages/Disclaimer';
import Help from '@/pages/Help';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <div className="min-h-screen">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;

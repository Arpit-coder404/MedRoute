import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DemoBanner } from './components/layout/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MapPage } from './pages/map/MapPage';
import { ResourceDirectoryPage } from './pages/resources/ResourceDirectoryPage';
import { ResourceDetailPage } from './pages/resources/ResourceDetailPage';
import { EmergencyPage } from './pages/emergency/EmergencyPage';
import { FirstAidPage } from './pages/firstaid/FirstAidPage';
import { ReportIssuePage } from './pages/reports/ReportIssuePage';
import { RequestsPage } from './pages/requests/RequestsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-warmwhite text-charcoal font-sans antialiased">
        {/* Top Simulation Disclaimer & Role Bar */}
        <DemoBanner />

        {/* Primary Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/resources" element={<ResourceDirectoryPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/first-aid" element={<FirstAidPage />} />
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;


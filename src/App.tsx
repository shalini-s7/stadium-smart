import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Sidebar } from './components/layout/Sidebar';
import { Chatbot } from './components/ui/Chatbot';
import { useMockFirestore } from './hooks/useMockFirestore';
import { useLiveSportsSimulator } from './services/liveSportsService';
import { ThemeProvider } from './components/layout/ThemeProvider';
import type { RootState } from './store/store';

// Dynamic imports
const Home = React.lazy(() => import('./apps/AttendeeApp/pages/Home'));
const CrowdMap = React.lazy(() => import('./apps/AttendeeApp/pages/CrowdMap'));
const UpcomingEvents = React.lazy(() => import('./apps/AttendeeApp/pages/Events'));
const Splash = React.lazy(() => import('./apps/AuthApp/Splash'));
const Login = React.lazy(() => import('./apps/AuthApp/Login'));
const Alerts = React.lazy(() => import('./apps/AttendeeApp/pages/Alerts'));
const MySeat = React.lazy(() => import('./apps/AttendeeApp/pages/MySeat'));
const Food = React.lazy(() => import('./apps/AttendeeApp/pages/Food'));
const Settings = React.lazy(() => import('./apps/AttendeeApp/pages/Settings'));

function App() {
  useMockFirestore();
  useLiveSportsSimulator();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <React.Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-b-2 border-white"></div></div>}>
          <Routes>
             <Route path="/" element={<Splash />} />
             <Route path="/login" element={<Login />} />
             <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      ) : (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 selection:bg-primary-500 selection:text-white transition-colors duration-300">
          {/* Desktop Sidebar (Hidden on mobile) */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 md:ml-64 w-full h-screen overflow-y-auto pb-16 md:pb-0 relative scroll-smooth bg-transparent">
            
            {/* Constrain content to a nice central column on giant monitors, but take full space on mobile */}
            <div className="max-w-5xl mx-auto w-full min-h-full bg-white dark:bg-slate-900 md:shadow-2xl border-x-0 md:border-x border-slate-200/60 dark:border-slate-800/60 relative transition-colors duration-300">
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                  <span className="animate-pulse font-medium text-lg tracking-wide">Loading Venue data...</span>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/map" element={<CrowdMap />} />
              <Route path="/events" element={<UpcomingEvents />} />
              <Route path="/my-seat" element={<MySeat />} />
              <Route path="/food" element={<Food />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </React.Suspense>
            </div>

            {/* Mobile bottom nav (Hidden on desktop) */}
            <div className="md:hidden block fixed bottom-0 left-0 right-0 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
              <BottomNavigation />
            </div>
            
            {/* Floating Chatbot Overlay */}
            <Chatbot />
            
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;

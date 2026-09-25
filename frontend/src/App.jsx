import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import AmbientBackground from './components/AmbientBackground';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MyProfiles from './pages/MyProfiles';
import ProfileDetail from './pages/ProfileDetail';
import FolioEditor from './pages/FolioEditor';
import PublicPortfolio from './pages/PublicPortfolio';
import TaloMatcher from './pages/TaloMatcher';
import CovoOutreach from './pages/CovoOutreach';
import LikoPost from './pages/LikoPost';
import MaliEmail from './pages/MaliEmail';
import Hub from './pages/Hub';
import Settings from './pages/Settings';

/**
 * Route guard for routes that require active authentication.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <div className="w-10 h-10 border-4 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-themeTextSecondary">Loading user session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route guard to redirect logged-in users away from Landing to Hub.
 */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <div className="w-10 h-10 border-4 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/hub" replace />;
  }

  return children;
}

function MainAppLayout() {
  const location = useLocation();
  // Hide navbar on public portfolio pages reactively
  const hideNavbar = location.pathname.startsWith('/p/');

  return (
    <div className="flex flex-col min-h-screen relative">
      <AmbientBackground />
      {!hideNavbar && <Navbar />}
      <main className="flex-grow relative z-10">
        <Routes>
          {/* Guest Only Routes */}
          <Route
            path="/"
            element={
              <GuestRoute>
                <Auth />
              </GuestRoute>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/hub"
            element={
              <ProtectedRoute>
                <Hub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <MyProfiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles/:id"
            element={
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/folio"
            element={
              <ProtectedRoute>
                <FolioEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talo"
            element={
              <ProtectedRoute>
                <TaloMatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/covo"
            element={
              <ProtectedRoute>
                <CovoOutreach />
              </ProtectedRoute>
            }
          />
          <Route
            path="/liko"
            element={
              <ProtectedRoute>
                <LikoPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mali"
            element={
              <ProtectedRoute>
                <MaliEmail />
              </ProtectedRoute>
            }
          />

          {/* Guest Public Route */}
          <Route
            path="/p/:slugOrId"
            element={<PublicPortfolio />}
          />

          {/* Fallback Catch-all Route redirects to Hub if logged in, else Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}

import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, initComplete, selectIsInitialized } from './features/auth/authSlice';
import axios from 'axios';
import useTokenRefresh from './hooks/useTokenRefresh';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { API_BASE_URL } from './utils/constants';

let authInitAttempted = false;

// Lazy load pages for code splitting and performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const VoiceAssistantPage = lazy(() => import('./pages/VoiceAssistantPage'));
const PersonalizationPage = lazy(() => import('./pages/PersonalizationPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component to display during fallback
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-[#223959]/20 border-t-[#223959] rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);

  /**
   * Initial Authentication Check
   * Attempts to refresh the user session on application load.
   * If successful, sets the user credentials in the Redux store.
   * Dispatches initComplete() regardless of outcome.
   */
  useEffect(() => {
    if (authInitAttempted) return;
    authInitAttempted = true;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/refresh`, { withCredentials: true });
        dispatch(setCredentials(data));
      } catch {
        // No valid session, user will need to log in manually
      } finally {
        dispatch(initComplete());
      }
    };
    checkAuth();
  }, [dispatch]);

  // Start background token refresh mechanism
  // This hook handles automatic access token renewal before expiration
  useTokenRefresh();

  // Show a loading screen until the initial auth check is complete
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-navy-500/20 border-t-navy-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ─── Public Routes ──────────────────────── */}
        {/* Accessible without authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ─── Protected Routes (inside AppLayout) ── */}
        {/* Requires valid authentication session */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* General routes accessible to all authenticated users */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/voice" element={<VoiceAssistantPage />} />
          <Route path="/personalization" element={<PersonalizationPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Role-based routes: Members + Admins only */}
          {/* Guests cannot access document management */}
          <Route
            path="/documents"
            element={
              <ProtectedRoute allowedRoles={['admin', 'member']}>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />

          {/* Role-based routes: Admins only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ─── 404 Catch-All ──────────────────────── */}
        {/* Rendered for any undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

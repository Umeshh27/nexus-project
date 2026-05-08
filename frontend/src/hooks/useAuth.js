import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectUserRole } from '../features/auth/authSlice';

/**
 * useAuth — Convenience hook for accessing auth state throughout the app.
 */
export default function useAuth() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: role === 'admin',
    isMember: role === 'member',
    isGuest: role === 'guest',
  };
}

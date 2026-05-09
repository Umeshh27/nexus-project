import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken, setCredentials, logout } from '../features/auth/authSlice';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (access token expires in 15)

/**
 * useTokenRefresh — Background auto-refresh of the access token.
 * Runs a silent refresh every 14 minutes to keep the session alive.
 */
export default function useTokenRefresh() {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      // No token = no refresh needed
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const refreshToken = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        dispatch(setCredentials(data));
      } catch {
        dispatch(logout());
      }
    };

    intervalRef.current = setInterval(refreshToken, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [accessToken, dispatch]);
}

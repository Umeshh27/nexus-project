import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include', // Send httpOnly cookies with every request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper that handles 401 by attempting a token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);

    if (refreshResult?.data) {
      // Store the new token
      api.dispatch({
        type: 'auth/setCredentials',
        payload: refreshResult.data,
      });
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — force logout
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Users', 'Documents', 'ChatSessions', 'AuditLogs', 'Organization', 'Stats'],
  endpoints: () => ({}), // Extended by feature-specific API slices
});

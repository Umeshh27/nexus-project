import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,         // { _id, name, email, role, organizationId }
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user) state.user = user;
      if (accessToken) state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    initComplete: (state) => {
      state.isInitialized = true;
    },
    logout: () => ({
      ...initialState,
      isInitialized: true,
    }),
  },
});

export const { setCredentials, updateUser, initComplete, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import documentReducer from '../features/documents/documentSlice';
import orgReducer from '../features/organization/orgSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    chat: chatReducer,
    documents: documentReducer,
    organization: orgReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSessionId: null,
  sessions: [],       // [{ _id, title, createdAt }]
  messages: [],       // Current conversation messages
  isStreaming: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1] = {
          ...state.messages[state.messages.length - 1],
          ...action.payload,
        };
      }
    },
    setStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },
    clearChat: () => initialState,
  },
});

export const {
  setCurrentSession,
  setSessions,
  setMessages,
  addMessage,
  updateLastMessage,
  setStreaming,
  clearChat,
} = chatSlice.actions;

export const selectCurrentSessionId = (state) => state.chat.currentSessionId;
export const selectSessions = (state) => state.chat.sessions;
export const selectMessages = (state) => state.chat.messages;
export const selectIsStreaming = (state) => state.chat.isStreaming;

export default chatSlice.reducer;

import { apiSlice } from '../auth/authApi';

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chat sessions for sidebar
    getChatSessions: builder.query({
      query: () => '/chat/sessions',
      providesTags: ['ChatSessions'],
    }),

    // Get a single chat session with messages
    getChatSession: builder.query({
      query: (sessionId) => `/chat/sessions/${sessionId}`,
      providesTags: (result, error, id) => [{ type: 'ChatSessions', id }],
    }),

    // Create a new chat session
    createChatSession: builder.mutation({
      query: () => ({
        url: '/chat/sessions',
        method: 'POST',
      }),
      invalidatesTags: ['ChatSessions'],
    }),

    // Send a message in a chat session
    sendMessage: builder.mutation({
      query: ({ sessionId, message }) => ({
        url: `/chat/sessions/${sessionId}/messages`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'ChatSessions', id: sessionId },
      ],
    }),

    // Delete a chat session
    deleteChatSession: builder.mutation({
      query: (sessionId) => ({
        url: `/chat/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ChatSessions'],
    }),
  }),
});

export const {
  useGetChatSessionsQuery,
  useGetChatSessionQuery,
  useCreateChatSessionMutation,
  useSendMessageMutation,
  useDeleteChatSessionMutation,
} = chatApiSlice;

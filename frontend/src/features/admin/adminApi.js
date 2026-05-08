import { apiSlice } from '../auth/authApi';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard stats
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),

    // Get all users in organization
    getOrgUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),

    // Change a user's role
    changeUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    // Deactivate a user
    deactivateUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    // Get all documents (admin view)
    getAdminDocuments: builder.query({
      query: () => '/admin/documents',
      providesTags: ['Documents'],
    }),

    // Delete any document (admin)
    adminDeleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `/admin/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents', 'Stats'],
    }),

    // Fetch generated invite tokens
    getInviteTokens: builder.query({
      query: () => '/admin/invites',
      providesTags: ['Invites'],
    }),

    createInviteToken: builder.mutation({
      query: ({ role, level }) => ({
        url: '/admin/invites',
        method: 'POST',
        body: { role, level },
      }),
    }),

    sendInviteEmail: builder.mutation({
      query: ({ code, email }) => ({
        url: '/admin/invites/send',
        method: 'POST',
        body: { code, email },
      }),
    }),

    // Get audit logs
    getAuditLogs: builder.query({
      query: (params) => ({
        url: '/audit/logs',
        params,
      }),
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetOrgUsersQuery,
  useChangeUserRoleMutation,
  useDeactivateUserMutation,
  useGetAdminDocumentsQuery,
  useAdminDeleteDocumentMutation,
  useGetInviteTokensQuery,
  useCreateInviteTokenMutation,
  useSendInviteEmailMutation,
  useGetAuditLogsQuery,
} = adminApiSlice;

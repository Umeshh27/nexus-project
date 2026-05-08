import { apiSlice } from '../auth/authApi';

export const orgApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current organization details
    getOrganization: builder.query({
      query: () => '/org',
      providesTags: ['Organization'],
    }),

    // Create a new organization
    createOrganization: builder.mutation({
      query: (data) => ({
        url: '/org/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),

    // Join an existing organization via invite code
    joinOrganization: builder.mutation({
      query: ({ inviteCode }) => ({
        url: '/org/join',
        method: 'POST',
        body: { inviteCode },
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useJoinOrganizationMutation,
} = orgApiSlice;

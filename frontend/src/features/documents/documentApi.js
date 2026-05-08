import { apiSlice } from '../auth/authApi';

export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents (filtered by role automatically on backend)
    getDocuments: builder.query({
      query: () => '/documents',
      providesTags: ['Documents'],
    }),

    // Upload a document
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: '/documents/upload',
        method: 'POST',
        body: formData,
        // Let browser set Content-Type with boundary for FormData
      }),
      invalidatesTags: ['Documents'],
    }),

    // Delete a document
    deleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = documentApiSlice;

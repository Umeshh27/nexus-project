import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  totalDocuments: 0,
  isUploading: false,
  uploadProgress: 0,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload.documents;
      state.totalDocuments = action.payload.total;
    },
    addDocument: (state, action) => {
      state.documents.unshift(action.payload);
      state.totalDocuments += 1;
    },
    removeDocument: (state, action) => {
      state.documents = state.documents.filter((doc) => doc._id !== action.payload);
      state.totalDocuments -= 1;
    },
    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
});

export const {
  setDocuments,
  addDocument,
  removeDocument,
  setUploading,
  setUploadProgress,
} = documentSlice.actions;

export const selectDocuments = (state) => state.documents.documents;
export const selectTotalDocuments = (state) => state.documents.totalDocuments;
export const selectIsUploading = (state) => state.documents.isUploading;
export const selectUploadProgress = (state) => state.documents.uploadProgress;

export default documentSlice.reducer;

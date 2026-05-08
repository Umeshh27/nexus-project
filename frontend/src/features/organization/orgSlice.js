import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organization: null, // { _id, name, inviteCode, createdBy }
};

const orgSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
    clearOrganization: () => initialState,
  },
});

export const { setOrganization, clearOrganization } = orgSlice.actions;

export const selectOrganization = (state) => state.organization.organization;

export default orgSlice.reducer;

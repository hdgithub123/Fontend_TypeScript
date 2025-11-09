import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction  } from '@reduxjs/toolkit';

interface headerState {
  userName: string | null,
  organizationIds: string[] | null,
  branchId: string | null,
  branchIds: string[] | null,
  departmentId: string | null,
  departmentIds: string[] | null
}



const initialState: headerState  = {
  userName: '',
  organizationIds: [],
  branchId: null,
  branchIds: [],
  departmentId: null,
  departmentIds: []
};



const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader: (state, action: PayloadAction<headerState>) => {
      Object.assign(state, action.payload);
    },
    resetHeader: () => initialState
  }
});

export const { setHeader, resetHeader } = headerSlice.actions;
export default headerSlice.reducer;

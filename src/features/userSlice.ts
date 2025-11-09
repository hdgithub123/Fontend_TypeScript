import { createSlice  } from '@reduxjs/toolkit';
import type { PayloadAction  } from '@reduxjs/toolkit';

interface UserState {
  userName: string;
  fullName: string;
  image: string;
  organizationCode: string;
  organizationName?: string;
}

const initialState: UserState = {
  userName: '',
  fullName: '',
  image: '',
  organizationCode: '',
  organizationName: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

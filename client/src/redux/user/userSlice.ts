import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  email: string;
  username: string;
  profilePicture: string;
};

type InitialState = {
  currentUser: User | null;
  error: null;
  loading: boolean;
};

const initialState: InitialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state: { loading: boolean }) => {
      state.loading = true;
    },
    signInSuccess: (state: InitialState, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state: InitialState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signoutSuccess } =
  userSlice.actions;

export default userSlice.reducer;

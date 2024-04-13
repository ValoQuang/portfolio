import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  email: string;
  username: string;
  profilePicture: string;
  isAdmin: boolean;
  _id: string;
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
    updateStart: (state: { loading: boolean; error: null }) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state: InitialState, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state: InitialState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state: InitialState) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state: InitialState) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state: InitialState, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signoutSuccess,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;

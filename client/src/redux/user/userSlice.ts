import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  currentUser: null;
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
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;

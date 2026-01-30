import { postSignupThunk } from "@/communication/signup-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signupState {
  passwordShown: boolean;
  signupLoading: boolean;
  error: boolean;
}

const initialState: signupState = {
  passwordShown: false,
  signupLoading: false,
  error: false,
};

export const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    togglePasswordShown: (state) => {
      state.passwordShown = !state.passwordShown;
      console.log(state.passwordShown);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postSignupThunk.pending, (state) => {
        state.signupLoading = true;
      })
      .addCase(postSignupThunk.fulfilled, (state) => {
        state.signupLoading = false;
      })
      .addCase(postSignupThunk.rejected, (state) => {
        state.signupLoading = false;
        state.error = true;
      });
  },
});

export default signupSlice.reducer;
export const { togglePasswordShown } = signupSlice.actions;

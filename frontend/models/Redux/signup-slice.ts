import { postSignupThunk } from "@/communication/signup-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signupState {
  passwordShown: boolean;
  signupLoading: boolean;
  errorMessage: string | null;
}

const initialState: signupState = {
  passwordShown: false,
  signupLoading: false,
  errorMessage: null,
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
      .addCase(postSignupThunk.rejected, (state, action) => {
        state.signupLoading = false;
        state.errorMessage = action.payload
          ? action.payload
          : "Unknown error occured when attempting to signup";
      });
  },
});

export default signupSlice.reducer;
export const { togglePasswordShown } = signupSlice.actions;

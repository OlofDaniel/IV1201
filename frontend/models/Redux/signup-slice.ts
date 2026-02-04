/* 
  State handeling for the sign up process:
  passwordShown: whether or not the password in the signup form is visible or not, changes when user clicks 'eye-icon'
  signupLoading: loading state of the signup process after cliking 'signup'
  errorMessage: stores the error message if an error occursr
*/

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

/*
Signup slice
reducers:
  togglePasswordShown: changes the state of passwordShown between true and false (toggle)
extraReducers:
  sets the loading state to true when pending, and false when not pending
  sets error message if occured
*/

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

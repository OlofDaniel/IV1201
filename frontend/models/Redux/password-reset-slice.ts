import { createSlice } from "@reduxjs/toolkit";
import { postResetThunk } from "@/communication/password-reset-communication";

/* 
  State handling for the password reset request process:
  emailSent: whether or not the password reset email has been attempted by the auth server.
  loading: loading state of the reset password process after cliking 'submit''
  errorMessage: stores the error message if an error occurs  
*/
interface PasswordResetState {
  emailSent: boolean;
  loading: boolean;
  errorMessage: null | string;
}

const initialState: PasswordResetState = {
  emailSent: false,
  loading: false,
  errorMessage: null,
};

/*
passwordReset slice
extraReducers:
  sets the loading state to true when pending, and false when not pending
  sets email sent to true when fulfilled
  sets error message if an error occured
*/

export const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    resetPasswordState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postResetThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(postResetThunk.fulfilled, (state) => {
        state.loading = false;
        state.emailSent = true;
      })
      .addCase(postResetThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        state.errorMessage =
          payload?.message ?? "Something went wrong, try again later";
      });
  },
});

export const { resetPasswordState } = passwordResetSlice.actions;

export default passwordResetSlice.reducer;

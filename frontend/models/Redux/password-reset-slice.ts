import { createSlice } from "@reduxjs/toolkit";
import { postResetThunk } from "@/communication/password-reset-communication";

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

export const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    resetPasswordResetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postResetThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(postResetThunk.fulfilled, (state) => {
        state.loading = false;
        state.emailSent = true;
      })
      .addCase(postResetThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetPasswordResetState } = passwordResetSlice.actions;

export default passwordResetSlice.reducer;

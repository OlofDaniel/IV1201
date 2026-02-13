import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postPasswordUpdateThunk } from "@/communication/password-reset-communication";

interface updatePasswordState {
  passwordShown: boolean;
  linkParsed: boolean;
  passwordUpdated: boolean;
  loading: boolean;
  errorMessage: null | string;
  linkExpired: boolean;
}

const initialState: updatePasswordState = {
  linkExpired: false,
  linkParsed: false,
  passwordShown: false,
  passwordUpdated: false,
  loading: false,
  errorMessage: null,
};

export const updatePasswordSlice = createSlice({
  name: "updatePassword",
  initialState,
  reducers: {
    updatePasswordState: () => initialState,
    togglePasswordShown: (state) => {
      state.passwordShown = !state.passwordShown;
    },
    setLinkExpired: (state) => {
      state.linkExpired = true;
    },
    setLinkParsed: (state, action: PayloadAction<boolean>) => {
      state.linkParsed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postPasswordUpdateThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(postPasswordUpdateThunk.fulfilled, (state) => {
        state.loading = false;
        state.passwordUpdated = true;
      })
      .addCase(postPasswordUpdateThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        state.errorMessage =
          payload?.message ?? "Something went wrong, try again later";
      });
  },
});

export const {
  updatePasswordState,
  togglePasswordShown,
  setLinkExpired,
  setLinkParsed,
} = updatePasswordSlice.actions;

export default updatePasswordSlice.reducer;

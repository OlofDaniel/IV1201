import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postPasswordUpdateThunk } from "@/communication/password-reset-communication";

/* 
  State handeling for the update password process:
  passwordShown: whether or not the password in the update password form is visible or not, changes when user clicks 'eye-icon'
  loading: loading state of the update password process after cliking 'submit''
  errorMessage: stores the error message if an error occursr
  linkExpired: whether or not the link is expired, which is used to indicate an invalid link
  linkParsed: whether or not the link has been sanity-checked, which is used to indicate that the link has been sanity-checked
*/

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

/*
updatePassword slice
reducers:
  togglePasswordShown: changes the state of passwordShown between true and false (toggle)
  setLinkExpired: sets the state of linkExpired to true, which is used to indicate an invalid link
  setLinkParsed: sets the state of linkParsed to true, which is used to indicate that the link has been sanity-checked
extraReducers:
  sets the loading state to true when pending, and false when not pending
  sets error message if an error occured
*/
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

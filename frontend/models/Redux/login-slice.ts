/* 
  State handeling for the login process:
  passwordShown: whether or not the password in the login dialog is visible or not, changes when user clicks 'eye-icon'
  dialogIsOpen: whether or not the login dialog is open or not
  loginLoading: loading state of the login process after cliking 'login'
  errorMessage: stores the error message if an error occursr
*/

import { postLoginThunk } from "@/communication/login-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface loginState {
  passwordShown: boolean;
  dialogIsOpen: boolean;
  loginLoading: boolean;
  errorMessage: string | null;
}

const initialState: loginState = {
  passwordShown: false,
  dialogIsOpen: false,
  loginLoading: false,
  errorMessage: null,
};

/*
Signup slice
reducers:
  togglePasswordShown: changes the state of passwordShown between true and false (toggle)
  setDialogIsOpen: sets the state of dialogIsOpen to the value in the payload (true or false), the dialog subscribes to this value in dialogIsOpen
extraReducers:
  sets the loading state to true when pending, and false when not pending
  closes the dialog when login reques is fullfilled
  sets error message if occured
*/

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    togglePasswordShown: (state) => {
      state.passwordShown = !state.passwordShown;
    },
    setDialogIsOpen: (state, action: PayloadAction<boolean>) => {
      state.dialogIsOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginThunk.pending, (state) => {
        state.loginLoading = true;
        state.errorMessage = null;
      })
      .addCase(postLoginThunk.fulfilled, (state) => {
        state.loginLoading = false;
        state.dialogIsOpen = false;
        state.errorMessage = null;
      })
      .addCase(postLoginThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.errorMessage = action.payload
          ? action.payload
          : "Unknown error occurred when attempting to log in";
      });
  },
});

export default loginSlice.reducer;
export const { togglePasswordShown, setDialogIsOpen } = loginSlice.actions;

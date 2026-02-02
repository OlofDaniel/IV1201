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

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    togglePasswordShown: (state) => {
      state.passwordShown = !state.passwordShown;
      console.log(state.passwordShown);
    },
    setDialogIsOpen: (state, action: PayloadAction<boolean>) => {
      state.dialogIsOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginThunk.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(postLoginThunk.fulfilled, (state) => {
        state.loginLoading = false;
        state.dialogIsOpen = false;
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

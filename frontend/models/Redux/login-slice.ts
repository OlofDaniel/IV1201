import { postLoginThunk } from "@/communication/login-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface loginState {
  passwordShown: boolean;
  dialogIsOpen: boolean;
  loginLoading: boolean;
  error: boolean;
}

const initialState: loginState = {
  passwordShown: false,
  dialogIsOpen: false,
  loginLoading: false,
  error: false,
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
      .addCase(postLoginThunk.rejected, (state) => {
        state.loginLoading = false;
        state.error = true;
      });
  },
});

export default loginSlice.reducer;
export const { togglePasswordShown, setDialogIsOpen } = loginSlice.actions;

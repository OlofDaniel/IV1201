import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface loginState {
  username: string | null;
  password: string | null;
  passwordShown: boolean;
  dialogIsOpen: boolean;
}

const initialState: loginState = {
  username: null,
  password: null,
  passwordShown: false,
  dialogIsOpen: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    togglePasswordShown: (state) => {
      state.passwordShown = !state.passwordShown;
      console.log(state.passwordShown);
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      console.log(state.password);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      console.log(state.username);
    },
    setDialogIsOpen: (state, action: PayloadAction<boolean>) => {
      state.dialogIsOpen = action.payload;
    },
  },
});

export default loginSlice.reducer;
export const {
  togglePasswordShown,
  setPassword,
  setUsername,
  setDialogIsOpen,
} = loginSlice.actions;

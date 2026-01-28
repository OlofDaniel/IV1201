import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signupState {
  firstname: string | null;
  surname: string | null;
  personNumber: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
  passwordShown: boolean;
}

const initialState: signupState = {
  firstname: null,
  surname: null,
  personNumber: null,
  email: null,
  username: null,
  password: null,
  passwordShown: false,
};

export const signupSlice = createSlice({
  name: "signup",
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
  },
});

export default signupSlice.reducer;
export const { togglePasswordShown, setPassword, setUsername } =
  signupSlice.actions;

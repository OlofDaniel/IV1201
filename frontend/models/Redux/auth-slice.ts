import { postSignupThunk } from "@/communication/signup-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  loggedIn: boolean;
}

const initialState: authState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postSignupThunk.fulfilled, (state) => {
      state.loggedIn = true;
    });
  },
});

export default authSlice.reducer;

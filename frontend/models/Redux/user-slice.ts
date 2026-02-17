import { getUserInfoThunk } from "@/communication/user-info-commmunication";
import { createSlice } from "@reduxjs/toolkit";
import { postLoginThunk } from "@/communication/login-communication";

interface UserProfile {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
}

interface userState {
  loading: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  errorMessage: string | null;
}

const initialState: userState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  errorMessage: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoThunk.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        state.errorMessage =
          payload?.message ??
          "Unknown error occurred when attempting to get user info";
      })
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.errorMessage = null;

        const data = action.payload;

        state.user = {
          username: data.username,
          first_name: data.name,
          surname: data.surname,
          email: data.email,
          person_number: data.pnr,
        };
      })
      .addCase(postLoginThunk.fulfilled, (state, action) => {
        const data = action.payload;

        state.user = {
          username: data.username,
          first_name: data.firstname,
          surname: data.surname,
          email: data.email,
          person_number: data.personNumber,
        };
      });
  },
});

export default userSlice.reducer;

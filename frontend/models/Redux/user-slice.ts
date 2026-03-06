/* 
  State handeling for the user profile: 
  Holds the state of the user information such as username, first_name and more. 
*/
import { getUserInfoThunk } from "@/communication/user-info-commmunication";
import { postUsernameThunk} from "@/communication/user-info-commmunication";
import { createSlice } from "@reduxjs/toolkit";
import { postLoginThunk } from "@/communication/login-communication";
import { postSignupThunk } from "@/communication/signup-communication";

interface UserProfile {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
  role: string | null;
  person_id: number | null;
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

/*
User slice
extraReducers:
  getUserInfoThunk: updates the state of loading, errorMessage, isAuthenticated and user state in the different states: .pending, .fulfilled and rejected.
  postLoginThunk: changes the user state with the metadata returned from supabase.
  postSignupThunk: changes the user state with the metadata returned from supabase.
  postUsernameThunk: changes the user state with the metadata returned from supabase.
*/

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
          role:
            data.role_id === 1
              ? "recruiter"
              : data.role_id === 2
                ? "applicant"
                : null,
          person_id: data.person_id,
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
          role:
            data.role_id === 1
              ? "recruiter"
              : data.role_id === 2
                ? "applicant"
                : null,
          person_id: data.person_id,
        };
      })
      .addCase(postSignupThunk.fulfilled, (state, action) => {
        const data = action.payload;

        state.user = {
          username: data.username,
          first_name: data.firstname,
          surname: data.surname,
          email: data.email,
          person_number: data.personNumber,
          role:
            data.role_id === 1
              ? "recruiter"
              : data.role_id === 2
                ? "applicant"
                : null,
          person_id: data.person_id,
        };
      })
      .addCase(postUsernameThunk.fulfilled, (state, action) => {
        const data = action.payload;

        state.user = {
          username: data.username,
          first_name: data.name,
          surname: data.surname,
          email: data.email,
          person_number: data.pnr,
          role:
              data.role_id === 1
                  ? "recruiter"
                  : data.role_id === 2
                      ? "applicant"
                      : null,
          person_id: data.person_id,
        };
      });
  },
});

export default userSlice.reducer;

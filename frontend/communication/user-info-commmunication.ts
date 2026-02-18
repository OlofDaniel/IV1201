import { createAsyncThunk } from "@reduxjs/toolkit";

interface UserInfoResponse {
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
}

interface GetInfoError {
  message: string;
  errors?: { [key: string]: string };
}

/*
  Communication logic for the user informatio:
  getUserInfo: Retrieves the user info from supabase. Such as username and person number and more.
  response: saves the response from the fetch call to the getUserInfo endpoint after the HTTP POST request
*/
const getUserInfo = async () => {
  const response = await fetch("http://localhost:8000/getinfo", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }

  return data;
};
/*
  Asynchronous thunk for the get user info process:
  getUserInfoThunk: dispatches status updates (pending, fulfilled, rejected) of the signup state
  await getUserInfow: executes the API call and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const getUserInfoThunk = createAsyncThunk<
  UserInfoResponse,
  void,
  { rejectValue: GetInfoError }
>("user/getUserInfo", async (_, thunkAPI) => {
  try {
    const data = await getUserInfo();
    return data;
  } catch (error: any) {
    if (error.status == "409") {
      return thunkAPI.rejectWithValue(error.detail);
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

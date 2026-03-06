import { createAsyncThunk } from "@reduxjs/toolkit";

interface UsernamePayload {
  person_id: number | null;
  new_username: string;
}

interface UserInfoResponse {
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
  role_id: number;
  person_id: number;
}

interface GetInfoError {
  message: string;
  errors?: { [key: string]: string };
}

/*
  Communication logic for the user information:
  getUserInfo: Retrieves the user info from Supabase. Such as username and person number and more.
  response: saves the response from the fetch call to the getUserInfo endpoint after the HTTP POST request
*/
const getUserInfo = async () => {
  const response = await fetch(`/api/getinfo`, {
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

/*
  Communication logic for post new username:
  postUsername: sends new username for user to supabase, with the corresponding person_id.
  response: returns user metadata from supabase.
*/

const postUsername = async (payload: UsernamePayload) => {
  const response = await fetch(`/api/updateusername`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      person_id: payload.person_id,
      new_username: payload.new_username,
    }),
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
  Asynchronous thunk for post username:
  postUsernameThunk: dispatches status updates (pending, fulfilled, rejected) of the user state
  await postUsername: executes the API call and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/

export const postUsernameThunk = createAsyncThunk<
  UserInfoResponse,
  UsernamePayload,
  { rejectValue: GetInfoError }
>("user/postUsername", async (payload, thunkAPI) => {
  try {
    return await postUsername(payload);
  } catch (error: any) {
    if (error.status == "409") {
      return thunkAPI.rejectWithValue({ message: error.detail });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

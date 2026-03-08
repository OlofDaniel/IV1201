import { createAsyncThunk } from "@reduxjs/toolkit";

/*
  Communication logic for the logout process:
  postLogout: handles the asynchronous communication from the frontend to the backend to log out a user
  response: saves the response from the fetch call to the logout endpoint after the HTTP POST request
*/

const postLogout = async () => {
  const response = await fetch("http://localhost:8000/logout", {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }

  return;
};

/*
  Asynchronous thunk for the logout process:
  postLogoutThunk: dispatches status updates (pending, fulfilled, rejected) of the logout loading state
  await postLogout: executes the API call  to log out and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postLogoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("logout/postLogoutThunk", async (_, thunkAPI) => {
  try {
    await postLogout();
    return;
  } catch (error: any) {
    if (error.detail) {
      return thunkAPI.rejectWithValue(error.detail);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

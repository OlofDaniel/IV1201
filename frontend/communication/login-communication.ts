import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  identifier: string;
  password: string;
};
/*
  Communication logic for the login process:
  postLogin: handles the asynchronous communication from the frontend to the backend with the users credentials
  response: saves the response from the fetch call to the login endpoint after the HTTP POST request
  JSON.stringify: formats the users credentials as a JSON payload for authentication
*/
const postLogin = async (payload: loginPayload) => {
  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to POST to /login with status: ${response.status}`);
  }

  return response.json();
};

/*
  Asynchronous thunk for the login process:
  postLoginThunk: dispatches status updates (pending, fulfilled, rejected) of the login loading state
  await postLogin: executes the API call with the login payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postLoginThunk = createAsyncThunk<
  void,
  loginPayload,
  { rejectValue: string }
>("login/postLoginThunk", async (payload, thunkAPI) => {
  try {
    await postLogin(payload);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

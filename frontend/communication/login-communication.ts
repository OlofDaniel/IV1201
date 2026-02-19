import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  identifier: string;
  password: string;
};
interface LoginResponse {
  username: string;
  firstname: string;
  surname: string;
  email: string;
  personNumber: string;
}
/*
  Communication logic for the login process:
  postLogin: handles the asynchronous communication from the frontend to the backend with the users credentials
  response: saves the response from the fetch call to the login endpoint after the HTTP POST request
  JSON.stringify: formats the users credentials as a JSON payload for authentication
*/
const postLogin = async (payload: loginPayload) => {
  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
  Asynchronous thunk for the login process:
  postLoginThunk: dispatches status updates (pending, fulfilled, rejected) of the login loading state
  await postLogin: executes the API call with the login payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postLoginThunk = createAsyncThunk<
  LoginResponse,
  loginPayload,
  { rejectValue: string }
>("login/postLoginThunk", async (payload, thunkAPI) => {
  try {
    const data = await postLogin(payload);

    const userInfo = data.user.metadata;

    return {
      username: userInfo.username,
      firstname: userInfo.name,
      surname: userInfo.surname,
      email: userInfo.email,
      personNumber: userInfo.pnr,
    };
  } catch (error: any) {
    if (error.status === 401) {
      return thunkAPI.rejectWithValue("Incorrect identifier or password");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

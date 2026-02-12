import { createAsyncThunk } from "@reduxjs/toolkit";

type passwordresetPayload = {
  email: string;
};

type passwordupdatePayload = {
  password: string;
  accessToken: string;
  refreshToken: string;
};

interface ResetError {
  message: string;
}

/*
  Communication logic for the password reset email request process:
  postReset: handles the asynchronous communication from the frontend to the backend with the users email
  data: saves the response from the fetch call to the reset endpoint after the HTTP POST request
  JSON.stringify: formats the users credentials as a JSON payload for authentication
*/
const postReset = async (payload: passwordresetPayload) => {
  const response = await fetch("http://127.0.0.1:8000/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
  Asynchronous thunk for the reset process:
  postResetThunk: dispatches status updates (pending, fulfilled, rejected) of the password reset loading state
  await postReset: executes the API call with the reset payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postResetThunk = createAsyncThunk<
  void,
  passwordresetPayload,
  { rejectValue: ResetError }
>("reset/postResetThunk", async (payload, thunkAPI) => {
  try {
    await postReset(payload);
  } catch (error: any) {
    if (error.status === 429) {
      return thunkAPI.rejectWithValue({
        message: "Too many reset attempts. Try again later.",
      });
    }

    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

/*
  Communication logic for the password update process:
  postPasswordUpdate: handles the asynchronous communication from the frontend to the backend with
  the users new password and session credentials.
  data: saves the response from the fetch call to the updatepassword endpoint after the HTTP POST request
  JSON.stringify: formats the credentials as a JSON payload for authentication
*/

const postPasswordUpdate = async (payload: passwordupdatePayload) => {
  const response = await fetch("http://127.0.0.1:8000/updatepassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: payload.password,
      access_token: payload.accessToken,
      refresh_token: payload.refreshToken,
    }),
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
  Asynchronous thunk for the password update process:
  postPasswordUpdateThunk: dispatches status updates (pending, fulfilled, rejected) of the password reset loading state
  await postPasswordUpdate: executes the API call with the update password payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postPasswordUpdateThunk = createAsyncThunk<
  void,
  passwordupdatePayload,
  { rejectValue: ResetError }
>("reset/postPasswordUpdateThunk", async (payload, thunkAPI) => {
  try {
    await postPasswordUpdate(payload);
  } catch (error: any) {
    if (error.status === 422) {
      return thunkAPI.rejectWithValue({
        message:
          error.detail?.message ??
          "Link har already been used or is invalid. Please request a new password reset.",
      });
    }

    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

import { createAsyncThunk } from "@reduxjs/toolkit";

type passwordresetPayload = {
  email: string;
};
/*
  Communication logic for the password reset process:
  postReset: handles the asynchronous communication from the frontend to the backend with the users email
  response: saves the response from the fetch call to the reset endpoint after the HTTP POST request
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

  if (!response.ok) {
    throw new Error(`Failed to POST to /reset with status: ${response.status}`);
  }

  return response.json();
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
  { rejectValue: string }
>("reset/postResetThunk", async (payload, thunkAPI) => {
  try {
    await postReset(payload);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

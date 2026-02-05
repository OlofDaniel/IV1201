import { createAsyncThunk } from "@reduxjs/toolkit";

interface signupPayload {
  firstname: string;
  surname: string;
  personNumber: string;
  email: string;
  username: string;
  password: string;
}

/*
  Communication logic for the signup process:
  postSignup: handles the communication from the frontend to the backend for account registration
  response: saves the response from the fetch call to the signup endpoint after the HTTP POST request
  JSON.stringify: converts the frontend naming conventions to match the backends expected format
*/
const postSignup = async (payload: signupPayload) => {
  const response = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: payload.firstname,
      surname: payload.surname,
      person_number: payload.personNumber,
      email: payload.email,
      username: payload.username,
      password: payload.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed POST to /signup with status: ${response.status}`);
  }

  return response.json();
};
/*
  Asynchronous thunk for the signup process:
  postSignupThunk: dispatches status updates (pending, fulfilled, rejected) of the signup state
  await postSignup: executes the API call with the signup payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postSignupThunk = createAsyncThunk<
  void,
  signupPayload,
  { rejectValue: string }
>("signup/postSignupThunk", async (payload, thunkAPI) => {
  try {
    await postSignup(payload);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

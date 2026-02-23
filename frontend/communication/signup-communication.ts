import { createAsyncThunk } from "@reduxjs/toolkit";

interface signupPayload {
  firstname: string;
  surname: string;
  personNumber: string;
  email: string;
  username: string;
  password: string;
}

interface SignupError {
  message: string;
  errors?: { [key: string]: string };
}
interface SignupResponse {
  username: string;
  firstname: string;
  surname: string;
  email: string;
  personNumber: string;
}
/*
  Communication logic for the signup process:
  postSignup: handles the communication from the frontend to the backend for account registration
  response: saves the response from the fetch call to the signup endpoint after the HTTP POST request
  JSON.stringify: converts the frontend naming conventions to match the backends expected format
*/
const postSignup = async (payload: signupPayload) => {
  const response = await fetch("http://localhost:8000/signup", {
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
  Asynchronous thunk for the signup process:
  postSignupThunk: dispatches status updates (pending, fulfilled, rejected) of the signup state
  await postSignup: executes the API call with the signup payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postSignupThunk = createAsyncThunk<
  SignupResponse,
  signupPayload,
  { rejectValue: SignupError }
>("signup/postSignupThunk", async (payload, thunkAPI) => {
  try {
    const data = await postSignup(payload);
    const userInfo = data.user.metadata;

    return {
      username: userInfo.username,
      firstname: userInfo.name,
      surname: userInfo.surname,
      email: userInfo.email,
      personNumber: userInfo.pnr,
    };
  } catch (error: any) {
    if (error.status == "409") {
      return thunkAPI.rejectWithValue(error.detail);
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

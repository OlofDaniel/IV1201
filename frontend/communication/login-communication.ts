import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  username: string;
  password: string;
};
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

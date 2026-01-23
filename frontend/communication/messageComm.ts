import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchData = async () => {
  const response = await fetch("http://127.0.0.1:8000/testing");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch from /testing with error code:  ${response.status}`,
    );
  }

  return response.json();
};

const postMessage = async (inputText: string) => {
  const response = await fetch("http://127.0.0.1:8000/testing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: inputText }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to POST to /testing with status: ${response.status}`,
    );
  }

  return response.json();
};

export const fetchMessageThunk = createAsyncThunk(
  "message/fetchMessageThunk",
  async (_, thunkAPI) => {
    try {
      return await fetchData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  },
);

export const postMessageThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("message/postMessageThunk", async (inputText, thunkAPI) => {
  try {
    await postMessage(inputText);
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

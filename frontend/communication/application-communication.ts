import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";

interface applicationPayload {
  competencies: Record<string, number | null>;
  availability: Array<{ from_date: string; to_date: string }>;
  person_id: number | null;
}

interface ApplicationError {
  message: string;
  errors?: { [key: string]: string };
}

const postApplication = async (payload: applicationPayload) => {
  const response = await fetch("http://localhost:8000/sendapplication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      availability_ranges: payload.availability,
      competencies: payload.competencies,
      person_id: payload.person_id,
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
};

export const postApplicationThunk = createAsyncThunk<
  void,
  applicationPayload,
  { rejectValue: ApplicationError }
>("application/postApplicationThunk", async (payload, thunkAPI) => {
  try {
    await postApplication(payload);
  } catch (error: any) {
    if (error.status == "400") {
      return thunkAPI.rejectWithValue({ message: error.detail });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

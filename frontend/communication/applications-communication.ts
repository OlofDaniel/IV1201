import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApplicationsResponse {
  person_id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  pnr: string;
  status: "Accepted" | "Rejected" | "Unhandled";
}

interface GetApplicationsError {
  message: string;
  errors?: { [key: string]: string };
}

const getApplications = async () => {
  const response = await fetch("http://127.0.0.1:8000/applications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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

export const getApplicationsThunk = createAsyncThunk<
  ApplicationsResponse[],
  void,
  { rejectValue: GetApplicationsError }
>("applications/getApplicationsThunk", async (_, thunkAPI) => {
  try {
    return await getApplications();
  } catch (error: any) {
    if (error.status == "401" || error.status == "500") {
      return thunkAPI.rejectWithValue(error.detail);
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

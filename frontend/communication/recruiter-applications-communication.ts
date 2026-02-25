import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApplicationsResponse {
  person_id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  pnr: string;
  application_status: "Accepted" | "Rejected" | "Unhandled";
}

interface GetApplicationsError {
  message: string;
  errors?: { [key: string]: string };
}

/*
  Communication logic for fetching applications for the recruiter page:
  getApplications: handles the communication from the frontend to the backend for fetching applications
  response: saves the response from the fetch call to the applications endpoint after the HTTP GET request
*/

const getApplications = async () => {
  const response = await fetch("http://localhost:8000/recruiter", {
    method: "GET",
    credentials: "include",
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

/*
  Asynchronous thunk for fetching applications:
  getApplicationsThunk: dispatches status updates (pending, fulfilled, rejected) of the applications fetching state
  await getApplications: executes the API call to fetch applications and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/

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

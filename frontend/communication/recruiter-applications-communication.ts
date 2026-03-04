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

interface UpdatedApplication {
  id: string;
  status: "Accepted" | "Rejected" | "Unhandled";
}

interface UpdatedApplicationPayload {
  person_id: string;
  application_status: "Accepted" | "Rejected" | "Unhandled";
}

interface ApplicationUpdateError {
  message: string;
  errors?: { [key: string]: string };
}

/*
  Communication logic for fetching applications for the recruiter page:
  getApplications: handles the communication from the frontend to the backend for fetching applications
  response: saves the response from the fetch call to the applications endpoint after the HTTP GET request
*/
const getApplications = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter`, {
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
      return thunkAPI.rejectWithValue({ message: error.detail });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

/*
  Communication logic for posting application updates for the recruiter page:
  postApplicationUpdate: handles the communication from the frontend to the backend with the status updates
  data: saves the response from the fetch call to the updateapplication endpoint after the HTTP POST request
  JSON.stringify: formats the application updates as a JSON payload for the API call
*/
const postApplicationUpdate = async (payload: UpdatedApplicationPayload[]) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/updateapplication`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

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
  Asynchronous thunk for posting application updates:
  postApplicationUpdateThunk: dispatches status updates (pending, fulfilled, rejected) of the application update state
  await postApplicationUpdate: executes the API call with the update payload and waits for a response
  rejectWithValue: returns the correct error message if an error occurs
*/
export const postApplicationUpdateThunk = createAsyncThunk<
  void,
  UpdatedApplication[],
  { rejectValue: ApplicationUpdateError }
>("applications/postApplicationUpdateThunk", async (payload, thunkAPI) => {
  try {
    const formattedPayload: UpdatedApplicationPayload[] = payload.map(
      (app) => ({
        person_id: app.id,
        application_status: app.status,
      }),
    );
    await postApplicationUpdate(formattedPayload);
  } catch (error: any) {
    console.log("error caught", error);
    if (
      error.status == "401" ||
      error.status == "400" ||
      error.status == "500"
    ) {
      return thunkAPI.rejectWithValue({ message: error.detail });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});

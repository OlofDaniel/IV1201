import { createAsyncThunk } from "@reduxjs/toolkit";

interface applicationPayload {
  competencies: Record<string, number | null>;
  availability: Array<{ from_date: string; to_date: string }>;
  person_id: number | null;
}

interface ApplicationError {
  message: string;
  status?: number;
  errors?: { [key: string]: string };
}

interface getApplicationPayload {
  person_id: number | null;
}

interface applicationResponse {
  competencies: Record<string, number | null>;
  availability: Array<{ from_date: string; to_date: string }>;
  status: { application_status: string };
}

/*
  Communication logic for the sending the application:
  postApplication: Sends the application info to Supabase. Such as availability dates and competencies.
  response: checks whether the response is ok, if not it throws an exception
*/

const postApplication = async (payload: applicationPayload) => {
  const response = await fetch(`/api/sendapplication`, {
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

/*
  Asynchronous thunk for adding an application to the database:
  postApplicationThunk: sends the application and dispatches status updates (pending, fulfilled, rejected) of the application state
  await postApplication: executes the API call to send the application
  rejectWithValue: returns the correct error message if an error occurs
*/

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

/*
  Communication logic for the application information:
  getApplication: Retrieves the application info from Supabase. Such as availability dates and competencies.
  response: saves the response from the fetch call to the application endpoint after the HTTP POST request
*/

const getApplication = async (payload: getApplicationPayload) => {
  const response = await fetch(`/api/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
  return data;
};


/*
  Asynchronous thunk for getting an application from database:
  getUserInfoThunk: gets the application and dispatches status updates (pending, fulfilled, rejected) of the application state
  await getApplication: executes the API call and waits for the response
  rejectWithValue: returns the correct error message if an error occurs
*/

export const getApplicationThunk = createAsyncThunk<
  applicationResponse,
  getApplicationPayload,
  { rejectValue: ApplicationError }
>("application/getApplicationThunk", async (payload, thunkAPI) => {
  try {
    const data = await getApplication(payload);
    return data;
  } catch (error: any) {
    if (error.status == "404") {
      return thunkAPI.rejectWithValue({
        message: error.detail,
        status: error.status,
      });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
      status: 500,
    });
  }
});

import {
  postApplicationThunk,
  getApplicationThunk,
} from "@/communication/application-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface applicationState {
  loading: boolean;
  getApplicationLoading: boolean;
  errorMessage: string | null;
  applicationSentSuccess: boolean;
  currentApplication: {
    competencies: Record<string, number | null>;
    availability: Array<{ from_date: string; to_date: string }>;
    status: { application_status: string };
  } | null;
}

const initialState: applicationState = {
  loading: false,
  getApplicationLoading: false,
  errorMessage: null,
  applicationSentSuccess: false,
  currentApplication: null,
};

/*
Application slice
extraReducers:
  postApplicationThunk: updates the state of loading, errormessage and applicationSendSuccess in the different states .pending, .fulfilled and .rejected.
  getApplicationThunk: updates the state of getApplicationLoading, errormessage and currentApplication in the different states .pending, .fulfilled and .rejected.
*/


export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postApplicationThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.applicationSentSuccess = false;
      })
      .addCase(postApplicationThunk.fulfilled, (state) => {
        state.loading = false;
        state.errorMessage = null;
        state.applicationSentSuccess = true;
      })
      .addCase(postApplicationThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message
          ? action.payload.message
          : "Unknown error occurred when attempting to submit application";
        state.applicationSentSuccess = false;
      })
      .addCase(getApplicationThunk.pending, (state) => {
        state.getApplicationLoading = true;
        state.errorMessage = null;
      })
      .addCase(getApplicationThunk.fulfilled, (state, action) => {
        state.getApplicationLoading = false;
        state.errorMessage = null;
        state.currentApplication = action.payload;
      })
      .addCase(getApplicationThunk.rejected, (state, action) => {
        state.getApplicationLoading = false;
        state.errorMessage = action.payload?.message
          ? action.payload.message
          : "Unknown error occurred when attempting to retrieve application";
        state.loading = false;
        state.errorMessage = null;
      });
  },
});

export default applicationSlice.reducer;
//export const {  } = applicationSlice.actions;

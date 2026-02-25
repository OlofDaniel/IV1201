import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApplicationsThunk } from "@/communication/recruiter-applications-communication";

/*
  State handling for the recruiter page:
  applications: list of all applications fetched from the backend
  updatedApplications: list of applications that have been updated by the user but not yet sent to the backend
  selectedApplication: the application that is currently selected by the user, null if no application is selected
  applicationsLoading: loading state of the applications fetching process
  errorMessage: stores the error message if an error occurs when fetching applications
*/

export interface Application {
  id: string; // Person_id
  firstname: string;
  surname: string;
  email: string;
  personNumber: string;
  username: string;
  status: "Accepted" | "Rejected" | "Unhandled";
}

interface recruiterState {
  applications: Application[];
  updatedApplications: Application[];
  selectedApplication: Application | null;
  applicationsLoading: boolean;
  errorMessage: string | null;
}

const initialState: recruiterState = {
  applications: [],
  updatedApplications: [],
  selectedApplication: null,
  applicationsLoading: false,
  errorMessage: null,
};

/*
recruiter slice
reducers:
  setNewStatus: updates the status of an application in the applications list and adds it to the updatedApplications list if it's not already there
  setSelectedApplication: sets the selected application to the one passed in the action payload
extraReducers:
  sets the loading state to true when pending, and false when not pending
  maps database response to the application model and stores it in the state upon success
  sets error message if an error occured when fetching applications
*/

export const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,
  reducers: {
    setNewStatus: (
      state,
      action: PayloadAction<{ id: string; newStatus: Application["status"] }>,
    ) => {
      const { id, newStatus } = action.payload;

      const application = state.applications.find((app) => app.id === id);

      if (application) {
        application.status = newStatus;

        const updatedApplication = state.updatedApplications.find(
          (app) => app.id === id,
        );

        if (updatedApplication) {
          updatedApplication.status = newStatus;
        } else {
          state.updatedApplications.push(application);
        }
      }
    },
    setSelectedApplication: (
      state,
      action: PayloadAction<Application | null>,
    ) => {
      state.selectedApplication = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationsThunk.pending, (state) => {
        state.applicationsLoading = true;
      })
      .addCase(getApplicationsThunk.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.errorMessage = null;

        const data = action.payload;

        state.applications = data.map((app) => ({
          id: app.person_id,
          firstname: app.name,
          surname: app.surname,
          email: app.email,
          personNumber: app.pnr,
          username: app.username,
          status: app.application_status,
        }));
      })
      .addCase(getApplicationsThunk.rejected, (state, action) => {
        state.applicationsLoading = false;

        const payload = action.payload;

        state.errorMessage =
          payload?.message ??
          "Unknown error occurred when attempting to get applications";
      });
  },
});

export default recruiterSlice.reducer;
export const { setNewStatus, setSelectedApplication } = recruiterSlice.actions;

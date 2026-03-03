import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getApplicationsThunk,
  postApplicationUpdateThunk,
} from "@/communication/recruiter-applications-communication";
import { getApplicationThunk } from "@/communication/application-communication";

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
  initialStatus: "Accepted" | "Rejected" | "Unhandled";
}

export interface UpdatedApplication {
  id: string;
  status: Application["status"];
}

interface recruiterState {
  getApplicationLoading: boolean;
  applications: Application[];
  updatedApplications: UpdatedApplication[];
  selectedApplication: Application | null;
  applicationsLoading: boolean;
  saveChangesLoading: boolean;
  saveSuccess: boolean;
  errorMessages: {
    getApplicationsError: string | null;
    saveChangesError: string | null;
    getApplicationDetailsError: string | null;
  };
  applicationDetails: {
    competencies: Record<string, number | null>;
    availability: Array<{ from_date: string; to_date: string }>;
    status: { application_status: string };
  } | null;
}

const defaultErrorMessages = {
  getApplicationsError: null,
  saveChangesError: null,
  getApplicationDetailsError: null,
};

const initialState: recruiterState = {
  getApplicationLoading: false,
  applications: [],
  updatedApplications: [],
  selectedApplication: null,
  applicationsLoading: false,
  saveChangesLoading: false,
  saveSuccess: false,
  errorMessages: defaultErrorMessages,
  applicationDetails: null,
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

        if (newStatus === application.initialStatus) {
          state.updatedApplications = state.updatedApplications.filter(
            (upd) => upd.id !== id,
          );
        } else {
          const existingUpdate = state.updatedApplications.find(
            (upd) => upd.id === id,
          );

          if (existingUpdate) {
            existingUpdate.status = newStatus;
          } else {
            state.updatedApplications.push({ id, status: newStatus });
          }
        }
      }
    },
    cancelStatusChanges: (state) => {
      state.applications.forEach((app) => {
        app.status = app.initialStatus;
      });
      state.updatedApplications = [];
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
        state.errorMessages = defaultErrorMessages;

        const data = action.payload;

        state.applications = data.map((app) => ({
          id: app.person_id,
          firstname: app.name,
          surname: app.surname,
          email: app.email,
          personNumber: app.pnr,
          username: app.username,
          status: app.application_status,
          initialStatus: app.application_status,
        }));
      })
      .addCase(getApplicationsThunk.rejected, (state, action) => {
        state.applicationsLoading = false;

        const payload = action.payload;
        state.errorMessages.getApplicationsError =
          payload?.message ??
          "Unknown error occurred when attempting to get applications";
      })
      .addCase(postApplicationUpdateThunk.pending, (state) => {
        state.saveChangesLoading = true;
        state.saveSuccess = false;
      })
      .addCase(postApplicationUpdateThunk.fulfilled, (state) => {
        state.saveChangesLoading = false;
        state.errorMessages = defaultErrorMessages;
        state.saveSuccess = true;

        state.applications.forEach((app) => {
          app.initialStatus = app.status;
        });

        state.updatedApplications = [];
      })
      .addCase(postApplicationUpdateThunk.rejected, (state, action) => {
        state.saveChangesLoading = false;
        state.saveSuccess = false;

        state.errorMessages.saveChangesError =
          action.payload?.message ??
          "Unknown error occurred when attempting to save";
      })
      .addCase(getApplicationThunk.pending, (state) => {
        state.getApplicationLoading = true;
        state.errorMessages = defaultErrorMessages;
        state.applicationDetails = null;
      })
      .addCase(getApplicationThunk.fulfilled, (state, action) => {
        state.getApplicationLoading = false;
        state.errorMessages = defaultErrorMessages;
        state.applicationDetails = action.payload;
      })
      .addCase(getApplicationThunk.rejected, (state, action) => {
        state.getApplicationLoading = false;
        if (action.payload?.status !== 400) {
          state.errorMessages.getApplicationDetailsError = action.payload
            ?.message
            ? action.payload.message
            : "Unknown error occurred when attempting to retrieve application";
          state.applicationDetails = null;
        }
      });
  },
});

export default recruiterSlice.reducer;
export const { setNewStatus, cancelStatusChanges, setSelectedApplication } =
  recruiterSlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApplicationsThunk } from "@/communication/applications-communication";

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
          status: app.status,
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

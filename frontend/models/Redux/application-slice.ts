import { postApplicationThunk } from "@/communication/application-communication";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface applicationState {
  loading: boolean;
  errorMessage: string | null;
  applicationSuccess: boolean;
}

const initialState: applicationState = {
  loading: false,
  errorMessage: null,
  applicationSuccess: false,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postApplicationThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.applicationSuccess = false;
      })
      .addCase(postApplicationThunk.fulfilled, (state) => {
        state.loading = false;
        state.errorMessage = null;
        state.applicationSuccess = true;
      })
      .addCase(postApplicationThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message
          ? action.payload.message
          : "Unknown error occurred when attempting to submit application";
        state.applicationSuccess = false;
      });
  },
});

export default applicationSlice.reducer;
//export const {  } = applicationSlice.actions;

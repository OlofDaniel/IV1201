import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMessageThunk } from "@/communication/messageComm";
import { toast } from "sonner";

interface messageState {
  message: string;
  loading: boolean;
  error: boolean;
}
const initialState: messageState = {
  message: "from store string",
  loading: false,
  error: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success("Success", { position: "top-center" });
      })
      .addCase(fetchMessageThunk.rejected, (state) => {
        state.loading = false;
        state.error = true;
        toast.error("Error", { position: "top-center" });
      });
  },
});

export const { setMessage } = messageSlice.actions;
export default messageSlice.reducer;

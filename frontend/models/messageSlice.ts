import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMessageThunk,
  postMessageThunk,
} from "@/communication/messageComm";
import { toast } from "sonner";

interface messageState {
  message: string;
  inputText: string;
  getLoading: boolean;
  postLoading: boolean;
  error: boolean;
}
const initialState: messageState = {
  message: "from store string",
  inputText: "",
  getLoading: false,
  postLoading: false,
  error: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageThunk.pending, (state) => {
        state.getLoading = true;
      })
      .addCase(fetchMessageThunk.fulfilled, (state, action) => {
        state.getLoading = false;
        state.message = action.payload.message;
        toast.success("Success", { position: "top-center" });
      })
      .addCase(fetchMessageThunk.rejected, (state) => {
        state.getLoading = false;
        state.error = true;
        toast.error("Error", { position: "top-center" });
      })
      .addCase(postMessageThunk.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(postMessageThunk.fulfilled, (state) => {
        state.postLoading = false;
      })
      .addCase(postMessageThunk.rejected, (state) => {
        state.postLoading = false;
        state.error = true;
      });
  },
});

export const { setMessage, setInputText } = messageSlice.actions;
export default messageSlice.reducer;

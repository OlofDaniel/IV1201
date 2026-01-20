import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface messageState {
  message: string;
}
const initialState: messageState = { message: "initial string" };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

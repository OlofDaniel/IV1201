import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface messageState {
  message: string;
}
const initialState: messageState = { message: "from store string" };

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = messageSlice.actions;
export default messageSlice.reducer;

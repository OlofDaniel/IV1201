import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../models/messageSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { message: messageReducer },
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

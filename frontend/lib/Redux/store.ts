import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/models/Redux/login-slice";

export const makeStore = () => {
  return configureStore({
    reducer: { login: loginReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

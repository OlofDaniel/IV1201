import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/models/Redux/login-slice";
import signupReducer from "@/models/Redux/signup-slice";
import userReducer from "@/models/Redux/user-slice";
import passwordResetReducer from "@/models/Redux/password-reset-slice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      login: loginReducer,
      signup: signupReducer,
      user: userReducer,
      passwordReset: passwordResetReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/models/Redux/login-slice";
import signupReducer from "@/models/Redux/signup-slice";
import authReducer from "@/models/Redux/auth-slice";
import passwordResetReducer from "@/models/Redux/password-reset-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      login: loginReducer,
      signup: signupReducer,
      auth: authReducer,
      passwordReset: passwordResetReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

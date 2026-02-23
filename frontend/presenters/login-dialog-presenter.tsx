"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { postLoginThunk } from "@/communication/login-communication";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

/* Genom att skicka in router hit kan vi styra navigeringen, 
samtidigt som det är enkelt att mocka routern i framtida tester. 
*/
export function createLoginPresenterHandlers(dispatch: AppDispatch) {
  return {
    onEyeClick: () => dispatch(togglePasswordShown()),

    onLoginClick: async (identifier: string, password: string) => {
      try {
        await dispatch(postLoginThunk({ identifier, password })).unwrap();
        dispatch(setDialogIsOpen(false));
        window.location.href = "/profile";
      } catch (error) {
        // Error message is handled in the slice, so we don't need to do anything here
      }
    },

    onOpenChange: (open: boolean) => dispatch(setDialogIsOpen(open)),
  };
}

export function LoginDialogPresenter() {
  const dispatch = useDispatch<AppDispatch>();

  const { loginLoading, passwordShown, dialogIsOpen, errorMessage } =
    useSelector((state: RootState) => state.login);

  const loginHandlers = createLoginPresenterHandlers(dispatch);

  return (
    <LoginDialog
      loginLoading={loginLoading}
      errorMessage={errorMessage}
      passwordShown={passwordShown}
      dialogIsOpen={dialogIsOpen}
      {...loginHandlers}
    />
  );
}

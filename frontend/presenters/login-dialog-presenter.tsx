"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { postLoginThunk } from "@/communication/login-communication";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";
import {toast} from "sonner";

export function createLoginPresenterHandlers(dispatch: AppDispatch) {
  /* Creates handlers for login dialog, was used for login logic testing,
  but since testing was abandoned it's not necessary anymore */
  return {
    /* Dispatches the togglePasswordShown action*/
    onEyeClick: () => dispatch(togglePasswordShown()),

    /*Dispatches the postLoginThunk, if successful the user is mobved to their profile page*/
    onLoginClick: async (identifier: string, password: string) => {
      try {
        await dispatch(postLoginThunk({ identifier, password })).unwrap();
        dispatch(setDialogIsOpen(false));
        window.location.href = "/profile";
      } catch (error) {
        // Error message is handled in the slice, so we don't need to do anything here
        toast.error("Something went wrong when trying to login");

      }
    },

    onOpenChange: (open: boolean) => dispatch(setDialogIsOpen(open)),
  };
}

export function LoginDialogPresenter() {
  /* Presenter for the login dialog */
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

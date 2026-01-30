"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { postLoginThunk } from "@/communication/login-communication";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

// Having the creation of handler functions outside the actual presenter allows for useful testing, not needing to render the view and create a store to test.
export function createLoginPresenterHandlers(dispatch: AppDispatch) {
  return {
    onEyeClick: () => dispatch(togglePasswordShown()),
    onLoginClick: (username: string, password: string) =>
      dispatch(postLoginThunk({ username: username, password: password })),
    onOpenChange: (open: boolean) => dispatch(setDialogIsOpen(open)),
  };
}

export function LoginDialogPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { loginLoading, passwordShown, dialogIsOpen, error } = useSelector(
    (state: RootState) => state.login,
  );
  const loginHandlers = createLoginPresenterHandlers(dispatch);
  return (
    <LoginDialog
      loginLoading={loginLoading}
      error={error}
      passwordShown={passwordShown}
      dialogIsOpen={dialogIsOpen}
      {...loginHandlers}
    ></LoginDialog>
  );
}

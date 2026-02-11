"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { postLoginThunk } from "@/communication/login-communication";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

/* 
createLoginPresenterHandlers: Having the creation of handler functions outside the actual presenter allows for useful testing, not needing to render the view and create a store to test. 
*/
export function createLoginPresenterHandlers(dispatch: AppDispatch) {
  return {
    onEyeClick: () => dispatch(togglePasswordShown()),
    onLoginClick: (identifier: string, password: string) =>
      dispatch(postLoginThunk({ identifier: identifier, password: password })),
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
    ></LoginDialog>
  );
}

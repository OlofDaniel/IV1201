"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { postLoginThunk } from "@/communication/login-communication";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

export function LoginDialogPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { loginLoading, passwordShown, dialogIsOpen, error } = useSelector(
    (state: RootState) => state.login,
  );
  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };
  const onLoginClick = (username: string, password: string) => {
    dispatch(postLoginThunk({ username: username, password: password }));
  };
  const onOpenChange = (value: boolean) => {
    dispatch(setDialogIsOpen(value));
  };
  return (
    <LoginDialog
      loginLoading={loginLoading}
      error={error}
      passwordShown={passwordShown}
      dialogIsOpen={dialogIsOpen}
      onEyeClick={onEyeClick}
      onLoginClick={onLoginClick}
      onOpenChange={onOpenChange}
    ></LoginDialog>
  );
}

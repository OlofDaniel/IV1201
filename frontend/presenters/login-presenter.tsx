"use client";
import { LoginDialog } from "@/components/ui/custom/login-dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  togglePasswordShown,
  setPassword,
  setUsername,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

export function LoginPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { username, password, passwordShown, dialogIsOpen } = useSelector(
    (state: RootState) => state.login,
  );
  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };
  const onLoginClick: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { username, password } = Object.fromEntries(formData) as Record<
      string,
      string
    >;
    dispatch(setPassword(password));
    dispatch(setUsername(username));
  };
  const onOpenChange = (value: boolean) => {
    dispatch(setDialogIsOpen(value));
  };
  return (
    <LoginDialog
      username={username}
      password={password}
      passwordShown={passwordShown}
      dialogIsOpen={dialogIsOpen}
      onEyeClick={onEyeClick}
      onLoginClick={onLoginClick}
      onOpenChange={onOpenChange}
    ></LoginDialog>
  );
}

"use client";
import { HeaderView } from "@/views/header-view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setDialogIsOpen } from "@/models/Redux/login-slice";

export function HeaderPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { loggedIn } = useSelector((state: RootState) => state.auth);
  const onLoginClick = () => {
    dispatch(setDialogIsOpen(true));
  };
  return <HeaderView onLoginClick={onLoginClick} loggedIn={loggedIn} />;
}

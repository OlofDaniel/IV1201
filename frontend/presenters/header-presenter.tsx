"use client";
import { HeaderView } from "@/views/header-view";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/Redux/store";
import { setDialogIsOpen } from "@/models/Redux/login-slice";

export function HeaderPresenter() {
  const dispatch = useDispatch<AppDispatch>();

  /*
  onLoginClick: sets the state of dialogIsOpen to true when login button is clicked in HeaderView
  */
  const onLoginClick = () => {
    dispatch(setDialogIsOpen(true));
  };
  return <HeaderView onLoginClick={onLoginClick} />;
}

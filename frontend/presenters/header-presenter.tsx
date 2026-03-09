"use client";
import { HeaderView } from "@/views/header-view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setDialogIsOpen } from "@/models/Redux/login-slice";
import { postLogoutThunk } from "@/communication/logout-communication";
import {toast} from "sonner";

export function HeaderPresenter() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );

  /*
  onLoginClick: sets the state of dialogIsOpen to true when login button is clicked in HeaderView
  */
  const onLoginClick = () => {
    dispatch(setDialogIsOpen(true));
  };
  /*
  onLogoutClick: calls the postLogoutThunk which sends a request to the backend to log the user out, 
  then re-routes the user to the homepage.
  */
  const onLogoutClick = async () => {
    try {
      await dispatch(postLogoutThunk()).unwrap();
      window.location.href = "/";
    } catch (error) {
      toast.error("Something went wrong when trying to logout");
    }
  };

  return (
    <HeaderView
      onLogoutClick={onLogoutClick}
      onLoginClick={onLoginClick}
      isAuthenticated={isAuthenticated}
      userLoading={loading}
    />
  );
}

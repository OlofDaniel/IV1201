"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpdatePasswordView } from "@/views/update-password-view";
import { postPasswordUpdateThunk } from "@/communication/password-reset-communication";
import {
  togglePasswordShown,
  setLinkExpired,
  setLinkParsed,
} from "@/models/Redux/update-password-slice";
export function UpdatePasswordPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    loading,
    errorMessage,
    passwordUpdated,
    passwordShown,
    linkExpired,
    linkParsed,
  } = useSelector((state: RootState) => state.updatePassword);

  /*UseEffect to show error message as a "toast" notification*/
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-center" });
    }
  }, [errorMessage]);

  /*UseEffect to indicate successful password update as a "toast" notification, 
  aswell as re-route the user to the homepage*/
  useEffect(() => {
    if (passwordUpdated) {
      toast.success("Password changed successfully!", {
        position: "top-center",
      });
      router.replace("/");
    }
  }, [passwordUpdated, router]);

  /*Used to sanity-check the link, ie. if it conatins an access token at all, a used link says 'access denied'*/
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get("error");

    if (error === "access_denied" || error === "expired") {
      dispatch(setLinkExpired());
    }
    dispatch(setLinkParsed(true));
  }, [dispatch]);

  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };

  /* When the update password form is submitted the password and tokens are used when to posting the update*/
  const onSubmit = (
    password: string,
    accessToken: string,
    refreshToken: string,
  ) => {
    dispatch(postPasswordUpdateThunk({ password, accessToken, refreshToken }));
  };

  return (
    <UpdatePasswordView
      linkExpired={linkExpired}
      linkParsed={linkParsed}
      passwordShown={passwordShown}
      updatePasswordLoading={loading}
      onSubmit={onSubmit}
      onEyeClick={onEyeClick}
    />
  );
}

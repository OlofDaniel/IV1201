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

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-center" });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (passwordUpdated) {
      toast.success("Password changed successfully!", {
        position: "top-center",
      });
      router.replace("/");
    }
  }, [passwordUpdated, router]);

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

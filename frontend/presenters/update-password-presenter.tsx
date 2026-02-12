"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { toast } from "sonner";
import { UpdatePasswordView } from "@/views/update-password-view";
import { postPasswordUpdateThunk } from "@/communication/password-reset-communication";
import { togglePasswordShown } from "@/models/Redux/update-password-slice";
export function UpdatePasswordPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, errorMessage, passwordUpdated, passwordShown } = useSelector(
    (state: RootState) => state.updatePassword,
  );
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-center" });
    }
  }, [errorMessage]);
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
      passwordShown={passwordShown}
      updatePasswordLoading={loading}
      passwordUpdated={passwordUpdated}
      onSubmit={onSubmit}
      onEyeClick={onEyeClick}
    />
  );
}

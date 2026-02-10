"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { PasswordResetView } from "@/views/password-reset-view";
import { postResetThunk } from "@/communication/password-reset-communication";
import { resetPasswordResetState } from "@/models/Redux/password-reset-slice";

export function PasswordResetPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, emailSent, errorMessage } = useSelector(
    (state: RootState) => state.passwordReset,
  );

  const onSubmit = (email: string) => {
    dispatch(postResetThunk({ email }));
  };

  return (
    <PasswordResetView
      passwordResetLoading={loading}
      emailSent={emailSent}
      errorMessage={errorMessage}
      onSubmit={onSubmit}
    />
  );
}

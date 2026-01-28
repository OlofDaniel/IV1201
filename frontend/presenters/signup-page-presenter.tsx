"use client";
import { SignupPageView } from "@/views/signup-page-view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";

import { togglePasswordShown } from "@/models/Redux/signup-slice";

export function SignupPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { passwordShown } = useSelector((state: RootState) => state.signup);
  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };
  return (
    <SignupPageView
      onEyeClick={onEyeClick}
      passwordShown={passwordShown}
    ></SignupPageView>
  );
}

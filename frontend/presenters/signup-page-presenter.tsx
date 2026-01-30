"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { SignupPageView } from "@/views/signup-page-view";
import { togglePasswordShown } from "@/models/Redux/signup-slice";
import { postSignupThunk } from "@/communication/signup-communication";

export function SignupPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { passwordShown, signupLoading, error } = useSelector(
    (state: RootState) => state.signup,
  );
  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };
  const onSignupClick = (
    firstname: string,
    surname: string,
    personNumber: string,
    email: string,
    username: string,
    password: string,
  ) => {
    dispatch(
      postSignupThunk({
        firstname: firstname,
        surname: surname,
        personNumber: personNumber,
        email: email,
        username: username,
        password: password,
      }),
    );
  };
  return (
    <SignupPageView
      passwordShown={passwordShown}
      signupLoading={signupLoading}
      error={error}
      onEyeClick={onEyeClick}
      onSignupClick={onSignupClick}
    ></SignupPageView>
  );
}

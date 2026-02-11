"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { SignupPageView } from "@/views/signup-page-view";
import { togglePasswordShown } from "@/models/Redux/signup-slice";
import { postSignupThunk } from "@/communication/signup-communication";

export function SignupPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { passwordShown, signupLoading, errorMessage, fieldErrors } =
    useSelector((state: RootState) => state.signup);
  /* 
  onEyeClick: toggles the value in passwordShown, hides password if false
  */
  useEffect(() => {
    if (errorMessage && Object.keys(fieldErrors).length === 0) {
      toast.error(errorMessage, { position: "top-center" });
    }
  }, [errorMessage, fieldErrors]);
  const onEyeClick = () => {
    dispatch(togglePasswordShown());
  };

  /* 
  onSignupClick: sends the provided user information from signupView to the thunk which sends it to backend endpoint
  */
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
      fieldErrors={fieldErrors}
      onEyeClick={onEyeClick}
      onSignupClick={onSignupClick}
    ></SignupPageView>
  );
}

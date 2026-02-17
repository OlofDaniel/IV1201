"use client";
import { ProfilePageView } from "@/views/profile-page-view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";

export function ProfileViewPresenter() {
  const { user, loading, isAuthenticated, errorMessage } = useSelector(
    (state: RootState) => state.user,
  );

  return (
    <ProfilePageView
      first_name={user?.first_name ?? ""}
      username={user?.username ?? ""}
      surname={user?.surname ?? ""}
      email={user?.email ?? ""}
      person_number={user?.person_number ?? ""}
      errorMessage={errorMessage}
      isAuthenticated={isAuthenticated}
      userLoading={loading}
    ></ProfilePageView>
  );
}

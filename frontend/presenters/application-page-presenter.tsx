"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { ApplicationPageView } from "@/views/application-page-view";

export function ApplicationPagePresenter() {
  const { user, loading, isAuthenticated, errorMessage } = useSelector(
    (state: RootState) => state.user,
  );
   return (
      <ApplicationPageView
        first_name={user?.first_name ?? ""}
        username={user?.username ?? ""}
        surname={user?.surname ?? ""}
        email={user?.email ?? ""}
        person_number={user?.person_number ?? ""}
        errorMessage={errorMessage}
        isAuthenticated={isAuthenticated}
        userLoading={loading}
      ></ApplicationPageView>
    );
}
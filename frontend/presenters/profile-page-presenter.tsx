"use client";
import { ProfilePageView } from "@/views/profile-page-view";
import { useSelector, useDispatch} from "react-redux";
import { RootState, AppDispatch } from "@/lib/Redux/store";
import { postUsernameThunk} from "@/communication/user-info-commmunication";


export function ProfileViewPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, isAuthenticated, errorMessage } = useSelector(
    (state: RootState) => state.user,
  );

  const onAddNewUsername = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const usernameRaw = formData.get("username");
    const username = typeof usernameRaw === "string" ? usernameRaw.trim() : "";

    if (!username) {
      console.warn("No username entered");
      return;
    }

    if (!user) {
      console.error("User not available");
      return;
    }

    try {
      await dispatch(
          postUsernameThunk({ person_id: user.person_id, new_username: username })
      ).unwrap();
      console.log("Username updated:", username);
    } catch (error) {
      console.error("Failed to update username:", error);
    }
    window.location.href = "/profile";
  };

  return (
    <ProfilePageView
      role={user?.role ?? ""}
      first_name={user?.first_name ?? ""}
      username={user?.username ?? ""}
      surname={user?.surname ?? ""}
      email={user?.email ?? ""}
      person_number={user?.person_number ?? ""}
      errorMessage={errorMessage}
      isAuthenticated={isAuthenticated}
      userLoading={loading}
      onAddNewUsername={onAddNewUsername}
    ></ProfilePageView>
  );
}

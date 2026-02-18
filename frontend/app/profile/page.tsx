import { ProfileViewPresenter } from "@/presenters/profile-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginDialogPresenter } from "@/presenters/login-dialog-presenter";

export default function ProfilePage() {
  return (
    <div>
      <HeaderPresenter></HeaderPresenter>
      <LoginDialogPresenter />
      <ProfileViewPresenter></ProfileViewPresenter>
    </div>
  );
}

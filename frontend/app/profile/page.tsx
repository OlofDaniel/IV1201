import { ProfileViewPresenter } from "@/presenters/profile-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";

export default function ProfilePage() {
  return (
    <div>
      <HeaderPresenter></HeaderPresenter>
      <ProfileViewPresenter></ProfileViewPresenter>
    </div>
  );
}

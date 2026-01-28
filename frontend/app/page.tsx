import { HomePagePresenter } from "@/presenters/home-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginDialogPresenter } from "@/presenters/login-dialog-presenter";

export default function Home() {
  return (
    <div>
      <HeaderPresenter />
      <LoginDialogPresenter />
      <HomePagePresenter />
    </div>
  );
}

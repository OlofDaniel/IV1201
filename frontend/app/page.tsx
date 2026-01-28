import { HomePagePresenter } from "@/presenters/home-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginPresenter } from "@/presenters/login-presenter";

export default function Home() {
  return (
    <div>
      <HeaderPresenter />
      <LoginPresenter />
      <HomePagePresenter />
    </div>
  );
}

import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginPresenter } from "@/presenters/login-presenter";

export default function Home() {
  return (
    <div>
      <HeaderPresenter />
      <LoginPresenter />
    </div>
  );
}

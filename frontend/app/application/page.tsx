import { ApplicationPagePresenter } from "@/presenters/application-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginDialogPresenter } from "@/presenters/login-dialog-presenter";

export default function ApplicationPage() {
  return (
    <div>
      <HeaderPresenter />
      <LoginDialogPresenter />
      <ApplicationPagePresenter />;
    </div>
  );
}

import { RecruiterPagePresenter } from "@/presenters/recruiter-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";
import { LoginDialogPresenter } from "@/presenters/login-dialog-presenter";

export default function RecruiterPage() {
  return (
    <div>
      <HeaderPresenter />
      <LoginDialogPresenter />
      <RecruiterPagePresenter></RecruiterPagePresenter>
    </div>
  );
}

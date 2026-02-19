import { ApplicationPagePresenter } from "@/presenters/application-page-presenter";
import { HeaderPresenter } from "@/presenters/header-presenter";

export default function ApplicationPage() {
  return (
    <div>
      <HeaderPresenter />
      <ApplicationPagePresenter />;
    </div>
  );
}

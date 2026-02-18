import { ApplicationForm } from "@/components/ui/custom/application-form";
import { CompetensSelection } from "@/components/ui/custom/compentence-selection";
export function ApplicationPageView() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-5">
        <h1 className="text-4xl">Application</h1>
      </div>
      <div>
        <CompetensSelection />
      </div>
    </div>
  );
}

import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApplicationDialogProps {
  dateRange: DateRange | undefined;
  selected: Record<string, boolean>;
  yearsOfExperience: Record<string, number>;
  onSubmit: () => void;
}

export function ApplicationDialog({
  dateRange,
  selected,
  yearsOfExperience,
  onSubmit,
}: ApplicationDialogProps) {
  const selectedCompetences = Object.entries(selected).filter(
    ([, isSelected]) => isSelected,
  );
  const COMPETENCE_LABELS: Record<string, string> = {
    "lotteries": "Lotteries",
    "roller-coaster": "Roller Coaster Operations",
    "ticket-sales": "Ticket Sales",
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-blue-300 hover:bg-blue-200"
            disabled={!dateRange?.from || !dateRange.to}
          >
            Review application
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review application</DialogTitle>
            <DialogDescription>
              Review your application and make sure everything is correct before
              sending
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Selected Competences:</h4>
              {selectedCompetences.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {selectedCompetences.map(([competence]) => (
                    <li key={competence}>
                      <span className="font-medium">
                        {COMPETENCE_LABELS[competence] ?? competence}
                      </span>{" "}- {yearsOfExperience[competence] || 0} years
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No competences selected.
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Availability:</h4>
              <p className="text-sm">
                {dateRange?.from
                  ? dateRange.from.toLocaleDateString()
                  : "Not selected"}
                {" - "}
                {dateRange?.to
                  ? dateRange.to.toLocaleDateString()
                  : "Not selected"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onSubmit} type="submit">
              Send application
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

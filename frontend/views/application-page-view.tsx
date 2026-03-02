import { CompetensSelection } from "@/components/ui/custom/compentence-selection";
import { CalendarPicker } from "@/components/ui/custom/calendar-picker";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/custom/card-skeleton";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { ApplicationDialog } from "@/components/ui/custom/application-dialog";
import { Trash2 } from "lucide-react";

interface ApplicationPageViewProps {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  userLoading: boolean;
  application: {
    selected: Record<string, boolean>;
    yearsOfExperience: Record<string, number>;
    dateRanges: DateRange[];
    actions: {
      onToggle: (id: string, checked: boolean) => void;
      onYearsChange: (id: string, years: number) => void;
      onSubmit: () => void;
      onAddDateRange: () => void;
      onUpdateDateRange: (index: number, range: DateRange | undefined) => void;
      onRemoveDateRange: (index: number) => void;
    };
  };
}

export function ApplicationPageView({
  username,
  first_name,
  surname,
  email,
  person_number,
  errorMessage,
  isAuthenticated,
  userLoading,
  application,
}: ApplicationPageViewProps) {
  const { selected, yearsOfExperience, dateRanges, actions } = application;
  const {
    onToggle,
    onYearsChange,
    onSubmit,
    onAddDateRange,
    onUpdateDateRange,
    onRemoveDateRange,
  } = actions;
  return userLoading ? (
    <div className="flex justify-center mt-20">
      <SkeletonCard />
    </div>
  ) : isAuthenticated ? (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-10">
        <h1 className="text-4xl">Application</h1>
      </div>
      <div className="relative z-10 flex flex-col items-center w-full mt-5 mb-15 border rounded-lg p-8 max-w-2xl">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {first_name} {surname}
              </h2>
              <p className="text-sm text-muted-foreground">Your information</p>
            </div>
            <div className="grid grid-cols-2 gap-y-2 border-t pt-4">
              <span className="font-bold">Username:</span>{" "}
              <span>{username}</span>
              <span className="font-bold">First name:</span>{" "}
              <span>{first_name}</span>
              <span className="font-bold">Surname:</span> <span>{surname}</span>
              <span className="font-bold">Email:</span> <span>{email}</span>
              <span className="font-bold">Person number:</span>
              {person_number}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full mt-8">
          <div>
            <CompetensSelection
              selected={selected}
              yearsOfExperience={yearsOfExperience}
              onToggle={onToggle}
              onYearsChange={onYearsChange}
            />
          </div>
          <div className="mt-10 w-full flex flex-col items-center gap-4">
            {dateRanges.length > 0 ? (
              dateRanges.map((range, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4"
                >
                  <div className="col-start-2 flex justify-center">
                    <CalendarPicker
                      dateRange={range}
                      onDateChange={(r) => onUpdateDateRange(idx, r)}
                    />
                  </div>
                  <div className="col-start-3 flex justify-start">
                    <Button
                      variant="ghost"
                      onClick={() => onRemoveDateRange(idx)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No availability periods added.
              </p>
            )}

            <div className="mt-2 w-full flex justify-center">
              <Button onClick={onAddDateRange}>Add availability period</Button>
            </div>
          </div>
          <div className="mt-10 w-75">
            <ApplicationDialog
              selected={selected}
              yearsOfExperience={yearsOfExperience}
              dateRanges={dateRanges}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">
            Please login to make an application
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

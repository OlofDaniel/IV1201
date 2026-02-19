import { CompetensSelection } from "@/components/ui/custom/compentence-selection";
import { CalendarPicker } from "@/components/ui/custom/calendar-picker";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/custom/card-skeleton";
import { Button } from "@/components/ui/button";

interface ApplicationPageViewProps {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  userLoading: boolean;
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
}: ApplicationPageViewProps) {
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
            <CompetensSelection />
          </div>
          <div className="mt-10 w-full flex justify-center">
            <CalendarPicker />
          </div>
          <div className="mt-10 w-75">
            <Button className="w-full">Send application</Button>
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

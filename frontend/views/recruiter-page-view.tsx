import Image from "next/image";
import { RecruiterApplicationTable } from "@/components/ui/custom/recruiter-application-table";
import { Application } from "@/models/Redux/recruiter-slice";
import { SkeletonTable } from "@/components/ui/custom/skelekton-table";

interface RecruiterPageViewProps {
  applications: Application[];
  selectedApplication: Application | null;
  applicationsLoading: boolean;
  getApplicationLoading: boolean;
  applicationDetails: {
    competencies: Record<string, number | null>;
    availability: Array<{ from_date: string; to_date: string }>;
    status: { application_status: string };
  } | null;
  saveChangesLoading: boolean;
  errorMessages: {
    getApplicationsError: string | null;
    saveChangesError: string | null;
    getApplicationDetailsError: string | null;
  };
  hasPendingChanges: boolean;
  onStatusChange: (id: string, newStatus: Application["status"]) => void;
  onRowClick: (app: Application) => void;
  onCloseRowClick: () => void;
  onSaveChangesClick: () => void;
  onCancelChangesClick: () => void;
}

export function RecruiterPageView({
  applicationsLoading,
  errorMessages,
  ...RecruiterProps
}: RecruiterPageViewProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Image
        src="/amuse1.jpg"
        alt="Amusement park"
        fill
        className="blur-sm object-cover scale-185 brightness-75"
      />

      <div className="absolute inset-x-0 top-0 mx-auto flex-col flex justify-center items-center w-full h-full max-w-5xl">
        <div className="w-full">
          {applicationsLoading ? (
            <SkeletonTable />
          ) : errorMessages.getApplicationsError ? (
            <div className="bg-red-50 border rounded-lg p-6 text-700">
              <p className="font-semibold">
                Error occured when getting applications:
              </p>
              <p>{errorMessages.getApplicationsError}</p>
            </div>
          ) : (
            <RecruiterApplicationTable
              {...RecruiterProps}
              errorMessage={errorMessages.getApplicationDetailsError}
            />
          )}
        </div>
      </div>
    </div>
  );
}

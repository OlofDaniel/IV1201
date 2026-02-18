import Image from "next/image";
import { RecruiterApplicationTable } from "@/components/ui/custom/recruiter-application-table";
import { Application } from "@/models/Redux/recruiter-slice";
import { SkeletonTable } from "@/components/ui/custom/skelekton-table";

interface RecruiterPageViewProps {
  applications: Application[];
  selectedApplication: Application | null;
  applicationsLoading: boolean;
  errorMessage: string | null;
  onStatusChange: (id: string, newStatus: Application["status"]) => void;
  onRowClick: (app: Application) => void;
  onCloseRowClick: () => void;
}

export function RecruiterPageView({
  applicationsLoading,
  errorMessage,
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
        <h1 className=" text-white text-6xl text-center">
          Welcome to the recruiter page
        </h1>
        <p className=" text-white text-center my-5 text-xl">
          List and review all applications and manage their statuses below
        </p>
        <div className="w-full">
          {applicationsLoading ? (
            <SkeletonTable />
          ) : errorMessage ? (
            errorMessage
          ) : (
            <RecruiterApplicationTable {...RecruiterProps} />
          )}
        </div>
      </div>
    </div>
  );
}

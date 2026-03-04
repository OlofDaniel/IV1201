import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/recruiter-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dot } from "lucide-react";

import { Application } from "@/models/Redux/recruiter-slice";
import { Spinner } from "../spinner";

interface RecruiterApplicationTableProps {
  errorMessage: string | null;
  getApplicationLoading: boolean;
  applicationDetails: {
    competencies: Record<string, number | null>;
    availability: Array<{ from_date: string; to_date: string }>;
    status: { application_status: string };
  } | null;
  applications: Application[];
  selectedApplication: Application | null;
  saveChangesLoading: boolean;
  hasPendingChanges: boolean;
  onStatusChange: (id: string, newStatus: Application["status"]) => void;
  onRowClick: (app: Application) => void;
  onSaveChangesClick: () => void;
  onCancelChangesClick: () => void;
}

export function RecruiterApplicationTable({
  onStatusChange,
  applications,
  onRowClick,
  onCancelChangesClick,
  onSaveChangesClick,
  selectedApplication,
  saveChangesLoading,
  hasPendingChanges,
  applicationDetails,
  getApplicationLoading,
  errorMessage,
}: RecruiterApplicationTableProps) {
  const columns: ColumnDef<Application>[] = [
    {
      id: "fullName",
      header: "Full name",
      accessorFn: (row) => `${row.firstname} ${row.surname}`,
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const application = row.original;

        return (
          <div
            className="relative flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(application);
            }}
          >
            <div className="absolute -left-9">
              <Dot
                size={35}
                className={
                  application.status === "Accepted"
                    ? "text-green-500"
                    : application.status === "Rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                }
              />
            </div>

            <Select
              value={application.status}
              onValueChange={(value) =>
                onStatusChange(application.id, value as Application["status"])
              }
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder={application.status} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Unhandled">Unhandled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
  ];

  const expandedRow = (app: Application) => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h4 className="font-bold text-slate-500">Extended User Details</h4>
          <p>Username: {app.username}</p>
          <p>Email: {app.email}</p>
          <p>Personal ID: {app.personNumber}</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-500">Competence</h4>
          {getApplicationLoading ? (
            <Spinner />
          ) : Object.entries(applicationDetails?.competencies || {}).length ===
              0 && !errorMessage ? (
            <p>No prior experience</p>
          ) : (
            Object.entries(applicationDetails?.competencies || {}).map(
              ([key, value]) => (
                <p key={key}>
                  {key}: {value} years
                </p>
              ),
            )
          )}
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
        <div>
          <h4 className="font-bold text-slate-500">Availability</h4>
          {getApplicationLoading ? (
            <Spinner />
          ) : (
            applicationDetails?.availability.map((range, idx) => (
              <p key={idx}>
                {range.from_date} to {range.to_date}
              </p>
            ))
          )}
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full pt-5 px-5 rounded-md border-[0.5px] border-black/10 bg-white">
      <DataTable<Application, unknown>
        columns={columns}
        data={applications}
        selectedRowId={selectedApplication?.id}
        saveChangesLoading={saveChangesLoading}
        hasPendingChanges={hasPendingChanges}
        onRowClick={onRowClick}
        expandedRow={expandedRow}
        onSaveChangesClick={onSaveChangesClick}
        onCancelChangesClick={onCancelChangesClick}
      />
    </div>
  );
}

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

interface RecruiterApplicationTableProps {
  applications: Application[];
  selectedApplication: Application | null;
  onStatusChange: (id: string, newStatus: Application["status"]) => void;
  onRowClick: (app: Application) => void;
}

export function RecruiterApplicationTable({
  applications,
  selectedApplication,
  onStatusChange,
  onRowClick,
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
            onClick={(e) => e.stopPropagation()}
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold text-slate-500">Extended User Details</h4>
          <p>Username: {app.username}</p>
          <p>Email: {app.email}</p>
          <p>Age: {app.personNumber}</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-500">Application Details</h4>
          <p>Years of Experience: 1 year </p>
          <p>Competence in: Ticket sales</p>
          <p>Availability: 26-06-02 - 26-08-13</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full pt-5 px-5 rounded-md border-[0.5px] border-black/10 bg-white">
      <DataTable<Application, unknown>
        columns={columns}
        data={applications}
        onRowClick={onRowClick}
        selectedRowId={selectedApplication?.id}
        expandedRow={expandedRow}
      />
    </div>
  );
}

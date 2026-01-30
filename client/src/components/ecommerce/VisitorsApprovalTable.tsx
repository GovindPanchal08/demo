import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  visitDate: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
}

const visitorData: Visitor[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    visitDate: "2026-01-10",
    purpose: "Meeting",
    status: "Pending",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    visitDate: "2026-01-12",
    purpose: "Delivery",
    status: "Approved",
  },
  {
    id: 3,
    name: "Mark Wilson",
    email: "mark@example.com",
    phone: "555-555-5555",
    visitDate: "2026-01-15",
    purpose: "Interview",
    status: "Rejected",
  },
];

export default function VisitorsApprovalTable() {
  const handleApprove = (id: number) => {
    console.log("Approve visitor", id);
    // Call API to approve visitor
  };

  const handleReject = (id: number) => {
    console.log("Reject visitor", id);
    // Call API to reject visitor
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Visitor Approvals
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Visitor Info
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Visit Details
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {visitorData.map((visitor) => (
              <TableRow key={visitor.id}>
                {/* Visitor Info */}
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {visitor.name}
                  </p>
                  <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                    {visitor.email} {visitor.phone && `| ${visitor.phone}`}
                  </p>
                </TableCell>

                {/* Visit Details */}
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <p>Date: {visitor.visitDate}</p>
                  <p>Purpose: {visitor.purpose}</p>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      visitor.status === "Approved"
                        ? "success"
                        : visitor.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {visitor.status}
                  </Badge>
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="py-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={visitor.status === "Approved"}
                    onClick={() => handleApprove(visitor.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    color="red"
                    disabled={visitor.status === "Rejected"}
                    onClick={() => handleReject(visitor.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import type { Role } from "../../types/role";

interface Props {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
}

export default function RoleTable({ roles, loading, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="   text-left py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Sr No
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Role Name
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-left  font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>

              <TableCell
                isHeader
                className="w-32 text-left py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {roles.map((role, index) => (
              <TableRow
                key={role.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {/* Sr No */}
                <TableCell className="  py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>

                {/* Role Name */}
                <TableCell className="py-3  text-gray-800 text-theme-sm dark:text-white/90">
                  {role.title}
                </TableCell>

                {/* Type */}
                <TableCell className="py-3  text-gray-500 text-theme-sm dark:text-gray-400">
                  {role.type}
                </TableCell>

                
                <TableCell className=" py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(role)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(role.id)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

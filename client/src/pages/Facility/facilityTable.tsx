import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index";
import { Edit2, Trash2 } from "lucide-react";
import { useFacility } from "./useFacility";
import { useState } from "react";

interface Facility {
  id: number;
  name: string;
}
interface Props {
  onEdit: (facility: Facility) => void;
}

export default function FacilityTable({ onEdit }: Props) {
  const { departments, updateDepartment, deleteDepartment } = useFacility();
  const [search, setSearch] = useState("");

  const editFacility = async (id: number, name: string) => {
    if (!confirm("Update this department?")) return;
    await updateDepartment(id, name);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartment(id);
  };

  const filtereddepartments = departments.filter((f: any) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-b">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sr No
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Facility Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {departments.map((facility, index) => (
              <TableRow key={facility.id}>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {index + 1}
                </TableCell>

                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {facility.name}
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(facility)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(facility.id)}
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

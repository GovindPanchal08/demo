import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index";
import { Edit2, Trash2 } from "lucide-react";
import Switch from "../../components/form/switch/Switch";

interface User {
  id: number;
  name: string;
  avatar: string; // URL for profile image
  email: string;
  phone?: string;
  status: "Active" | "Inactive";
}

// Sample data
const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/images/users/user-01.jpg",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/images/users/user-02.jpg",
    email: "jane.smith@example.com",
    phone: "+1 987 654 321",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alex Johnson",
    avatar: "/images/users/user-03.jpg",
    email: "alex.johnson@example.com",
    phone: "+1 555 555 555",
    status: "Active",
  },
];

export default function UserManagementTable() {
  const toggleStatus = (id: number, checked: boolean) => {
    const newStatus = checked ? "Active" : "Inactive";
    console.log("User ID:", id, "New Status:", newStatus);

    // 🔗 API call example
    // updateUserStatus(id, newStatus);
  };

  const editUser = (id: number) => {
    console.log("Edit user id:", id);
    // Navigate to edit form or modal
  };

  const deleteUser = (id: number) => {
    console.log("Delete user id:", id);
    // API call to delete
  };

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
                User Info
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.name}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <p>{user.email}</p>
                  {user.phone && <p>{user.phone}</p>}
                </TableCell>

                <TableCell className="py-3 text-theme-sm">
                  <Switch
                    label={user.status === "Active" ? "Active" : "Inactive"}
                    defaultChecked={user.status === "Active"}
                    onChange={(checked) => toggleStatus(user.id, checked)}
                    color="blue"
                  />
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editUser(user.id)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
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

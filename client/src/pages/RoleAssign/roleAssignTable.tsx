import {
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";

interface Menu {
  id: number;
  title: string;
  parentId?: number | null;
  children: Menu[];
}

interface Props {
  menus: Menu[];
  permissions: Record<number, number[]>;
  onToggleMenu: (menu: Menu) => void;
  onToggleAction: (menuId: number, actionId: number) => void;
}

export default function RoleAssignTable({
  menus,
  permissions,
  onToggleMenu,
  onToggleAction,
}: Props) {
  const isMenuChecked = (menu: Menu) => {
    const selected = permissions[menu.id] || [];
    if (!menu.children.length) return selected.includes(menu.id);
    return selected.length === menu.children.length;
  };

  const isMenuPartial = (menu: Menu) => {
    if (!menu.children.length) return false;
    const selected = permissions[menu.id]?.length || 0;
    return selected > 0 && selected < menu.children.length;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="w-20 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Select
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Menu
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {menus
              .filter((m) => !m.parentId)
              .map((menu) => (
                <TableRow key={menu.id}>
                  {/* Menu checkbox */}
                  <TableCell className="text-center py-3">
                    <button onClick={() => onToggleMenu(menu)}>
                      {isMenuChecked(menu) ? (
                        <CheckSquare size={20} className="text-blue-600" />
                      ) : isMenuPartial(menu) ? (
                        <MinusSquare size={20} className="text-blue-500" />
                      ) : (
                        <Square size={20} className="text-gray-300" />
                      )}
                    </button>
                  </TableCell>

                  {/* Menu title */}
                  <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                    {menu.title}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {menu.children.map((action) => {
                        const active = permissions[menu.id]?.includes(
                          action.id
                        );

                        return (
                          <button
                            key={action.id}
                            onClick={() =>
                              onToggleAction(menu.id, action.id)
                            }
                            className={`rounded-full border px-3 py-1 text-xs transition ${
                              active
                                ? "border-blue-300 bg-blue-100 text-blue-700"
                                : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-transparent"
                            }`}
                          >
                            {action.title}
                          </button>
                        );
                      })}
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

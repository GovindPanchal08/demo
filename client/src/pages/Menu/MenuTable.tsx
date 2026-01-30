import React, { useState } from "react";
import { Edit2 } from "lucide-react";
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
  slug: string;
  parentId?: number | null;
  children?: Menu[];
}

interface Props {
  menus: Menu[];
  loading: boolean;
  onEdit: (menu: Menu) => void;
}

const MenuTreeRow: React.FC<{
  menu: Menu;
  level?: number;
  index: number;
  expanded: number[];
  toggleExpand: (id: number) => void;
  onEdit: (menu: Menu) => void;
}> = ({ menu, level = 0, index, expanded, toggleExpand, onEdit }) => {
  const isExpanded = expanded.includes(menu.id);
  const hasChildren = menu.children && menu.children.length > 0;

  return (
    <>
      <TableRow>
        {/* Sr No */}
        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {index + 1}
        </TableCell>

        {/* Title */}
        <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
          <div
            className={`flex items-center gap-2 ${
              hasChildren ? "cursor-pointer" : ""
            }`}
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={() => hasChildren && toggleExpand(menu.id)}
          >
            {hasChildren && (
              <span className="text-gray-400">{isExpanded ? "▾" : "▸"}</span>
            )}
            {menu.title}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell className="py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(menu)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Children */}
      {isExpanded &&
        menu.children?.map((child, childIndex) => (
          <MenuTreeRow
            key={child.id}
            menu={child}
            level={level + 1}
            index={childIndex}
            expanded={expanded}
            toggleExpand={toggleExpand}
            onEdit={onEdit}
          />
        ))}
    </>
  );
};

export default function MenuTable({ menus, loading, onEdit }: Props) {
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
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
                Menu Title
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              menus
                .filter((m) => !m.parentId)
                .map((menu, index) => (
                  <MenuTreeRow
                    key={menu.id}
                    menu={menu}
                    index={index}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    onEdit={onEdit}
                  />
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import RoleAssignTable from "./roleAssignTable";

import { useRoles } from "../Role/useRoles";
import { useMenus } from "../Menu/useMenu";
import { useRoleAssignment } from "./useRoleAssignment";

import type { Role } from "../../types/role";

export default function RoleAssign() {
  const { roles } = useRoles();
  const { menus } = useMenus();

  const {
    permissions,
    fetchRoleMenus,
    toggleMenu,
    toggleAction,
    saveAssignments,
  } = useRoleAssignment();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      fetchRoleMenus(selectedRole.id);
    }
  }, [selectedRole, fetchRoleMenus]);

  const handleSave = async () => {
    if (!selectedRole) return;

    setSaving(true);
    try {
      await saveAssignments(selectedRole.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Role Permission Assignment" />

      {/* Role selector */}
      <div className="mb-4 max-w-sm">
        <select
          value={selectedRole?.id ?? ""}
          onChange={(e) =>
            setSelectedRole(
              roles.find((r) => r.id === Number(e.target.value)) || null
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-transparent"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
      </div>

      {/* RBAC Matrix */}
      {selectedRole ? (
        <>
          <RoleAssignTable
            menus={menus}
            permissions={permissions}
            onToggleMenu={toggleMenu}
            onToggleAction={toggleAction}
          />

          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
            >
              Save Permissions
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-20 text-center text-gray-400">
          Select a role to manage permissions
        </div>
      )}
    </>
  );
}

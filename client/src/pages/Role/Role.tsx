import { useState } from "react";
import { Plus } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import RoleTable from "./RoleTable";
import { useRoles } from "./useRoles";
import type { Role, RoleType } from "../../types/role";
import Select from "../../components/form/Select";

const ROLE_TYPES: { label: string; value: RoleType }[] = [
  { label: "Admin", value: "admin" },
  { label: "Host", value: "host" },
  { label: "Receptionist", value: "receptionist" },
];

export default function RoleManagement() {
  const { roles, loading, createRole, updateRole, deleteRole } = useRoles();

  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    type: RoleType | "";
  }>({
    title: "",
    type: "",
  });

  const resetForm = () => {
    setFormData({ title: "", type: "" });
    setEditingRole(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.type) return;

    if (editingRole) {
      await updateRole(editingRole.id, formData);
    } else {
      await createRole(formData);
    }

    resetForm();
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ title: role.title, type: role.type });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this role?")) return;
    await deleteRole(id);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Role Management" />

      <div className="flex justify-end mb-3">
        {!showForm && (
          <Button
            variant="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setShowForm(true)}
          >
            Create Role
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold">
            {editingRole ? "Edit Role" : "Create Role"}
          </h2>

          <div className="grid gap-4">
            <div>
              <Label>
                Role Name <span className="text-error-500">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <Label>
                Role Type <span className="text-error-500">*</span>
              </Label>
              <Select
                options={ROLE_TYPES}
                value={formData.type}
                placeholder="Select role type"
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as RoleType,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {editingRole ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <RoleTable
          roles={roles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

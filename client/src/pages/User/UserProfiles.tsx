import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Select from "../../components/form/Select";
import UserManagementTable from "./userTable";
import { Plus } from "lucide-react";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

export default function UserManagementPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create user:", form);

    setForm({ firstName: "", lastName: "", email: "", password: "", role: "" });
    setShowForm(false);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="User Management" />

      <div className="flex justify-end items-center mb-2">
        {!showForm && (
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            startIcon={<Plus size={16} />}
          >
            Create User
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Create User
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin can create dashboard users and assign roles
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="First name"
                />
              </div>

              <div>
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="user@company.com"
              />
            </div>

            <div>
              <Label>
                Role<span className="text-error-500">*</span>
              </Label>
              <Select
                options={ROLES}
                value={ROLES.find((r) => r.value === form.role)}
                onChange={(selected) => update("role", selected?.value || "")}
                placeholder="Select role"
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
              />
            </div>

            <div>
              <Label>
                Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a strong password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  !form.firstName.trim() ||
                  !form.lastName.trim() ||
                  !form.email.trim() ||
                  !form.role.trim()
                }
              >
                Create User
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* User Table */}
      {!showForm && <UserManagementTable />}
    </>
  );
}

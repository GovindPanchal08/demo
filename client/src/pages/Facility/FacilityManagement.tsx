import { useState } from "react";
import { Plus } from "lucide-react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FacilityTable from "./facilityTable";
import { useFacility } from "./useFacility";

interface Facility {
  id: number;
  name: string;
}

export function FacilityManagement() {
  const { loading, addDepartment, updateDepartment } = useFacility();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) return;

    if (editingFacility) {
      await updateDepartment(editingFacility.id, name.trim());
    } else {
      await addDepartment(name.trim());
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEditingFacility(null);
    setShowForm(false);
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setName(facility.name);
    setShowForm(true);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Facility Management" />

      <div className="flex justify-end items-center mb-2">
        {!showForm && (
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            startIcon={<Plus size={16} />}
          >
            Create Facility
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingFacility ? "Edit Facility" : "Create Facility"}
          </h2>

          <Label>
            Facility Name <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder="Facility name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddOrUpdate}
              disabled={!name.trim() || loading}
              startIcon={<Plus size={16} />}
            >
              {editingFacility ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <FacilityTable onEdit={handleEdit} />
      )}
    </>
  );
}

import { useState } from "react";
import { Plus } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import MenuTable from "./MenuTable";
import { useMenus } from "./useMenu";

interface Menu {
  id: number;
  title: string;
  slug: string;
  order: number;
  parentId?: number | null;
}

export default function MenuManagement() {
  const { menus, loading, createMenu, updateMenu } = useMenus();

  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    order: 0,
  });

  const resetForm = () => {
    setFormData({ title: "", slug: "", order: 0 });
    setEditingMenu(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) return;

    if (editingMenu) {
      await updateMenu(editingMenu.id, formData);
    } else {
      await createMenu(formData);
    }

    resetForm();
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      title: menu.title,
      slug: menu.slug,
      order: menu.order,
    });
    setShowForm(true);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Menu Management" />

      <div className="flex justify-end mb-3">
        {!showForm && (
          <Button
            variant="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setShowForm(true)}
          >
            Create Menu
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingMenu ? "Edit Menu" : "Create Menu"}
          </h2>

          <div className="grid gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <Label>Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {editingMenu ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <MenuTable menus={menus} loading={loading} onEdit={handleEdit} />
      )}
    </>
  );
}

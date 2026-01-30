import { useState, useEffect } from "react";
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Mail,
  User,
  IdCard,
  Building2,
} from "lucide-react";

import FormField from "../components/Form";
// import { apiCall } from "../../../hooks/useAPI"; // adjust path
import Button from "../../../components/ui/button/Button";
import MultiSelect from "../../../components/form/MultiSelect";

interface VisitorInfoData {
  name: string;
  email: string;
  phone: string;
  purpose: string;
}

interface StepVisitorInfoProps {
  data: VisitorInfoData;
  updateField: <K extends keyof VisitorInfoData>(
    field: K,
    value: VisitorInfoData[K]
  ) => void;
}

export function StepVisitorInfo({ data, updateField }: StepVisitorInfoProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Visitor Information
        </h2>
        <p className="text-sm text-gray-600">
          Please provide the basic details of the visitor
        </p>
      </header>

      <div className="space-y-4">
        <FormField
          label="Full Name"
          required
          value={data.name}
          onChange={(v) => updateField("name", v)}
          placeholder="Enter full name"
        />

        <FormField
          label="Email Address"
          required
          type="email"
          value={data.email}
          onChange={(v) => updateField("email", v)}
          placeholder="email@example.com"
        />

        <FormField
          label="Phone Number"
          required
          as="phone"
          value={data.phone}
          onChange={(v) => updateField("phone", v)}
        />

        <FormField
          label="Purpose of Visit"
          required
          isTextarea
          value={data.purpose}
          onChange={(v) => updateField("purpose", v)}
          placeholder="e.g., Meeting with HR department"
          rows={3}
        />
      </div>
    </div>
  );
}

interface GroupInfoData {
  group_name: string;
  group_leader_email: string;
  group_size: number;
}

interface StepGroupInfoProps {
  data: GroupInfoData;
  updateField: <K extends keyof GroupInfoData>(
    field: K,
    value: GroupInfoData[K]
  ) => void;
}

export function StepGroupInfo({ data, updateField }: StepGroupInfoProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Group Information
        </h2>
        <p className="text-sm text-gray-600">
          Provide details about the visiting group
        </p>
      </header>

      <div className="space-y-4">
        <FormField
          label="Group Name"
          required
          value={data.group_name}
          onChange={(v) => updateField("group_name", v)}
          placeholder="e.g., Tech Team from ABC Company"
        />

        <FormField
          label="Group Leader Email"
          required
          type="email"
          value={data.group_leader_email}
          onChange={(v) => updateField("group_leader_email", v)}
          placeholder="leader@example.com"
        />

        <FormField
          label="Expected Group Size"
          required
          type="number"
          value={data.group_size}
          onChange={(v) =>
            updateField("group_size", Math.max(1, Number(v) || 1))
          }
          placeholder="Number of visitors"
          min="1"
          max="100"
        />
      </div>
    </div>
  );
}

export interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  id_type: string;
  id_number: string;
}

interface StepVisitorListData {
  visitors: Visitor[];
  group_size: number;
}

interface StepVisitorListProps {
  data: StepVisitorListData;
  addVisitor: (visitor: Visitor) => void;
  removeVisitor: (id: number) => void;
  idTypes: string[];
}

export function StepVisitorList({
  data,
  addVisitor,
  removeVisitor,
  idTypes,
}: StepVisitorListProps) {
  const [tempVisitor, setTempVisitor] = useState<Omit<Visitor, "id">>({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    id_type: idTypes[0] ?? "",
    id_number: "",
  });

  const isValidVisitor =
    tempVisitor.name &&
    tempVisitor.email &&
    tempVisitor.phone &&
    tempVisitor.purpose &&
    tempVisitor.id_type &&
    tempVisitor.id_number;

  const handleAdd = () => {
    if (!isValidVisitor) return;

    addVisitor({
      ...tempVisitor,
      id: Date.now(),
    });

    setTempVisitor({
      name: "",
      email: "",
      phone: "",
      purpose: "",
      id_type: idTypes[0] ?? "",
      id_number: "",
    });
  };

  const remaining = Math.max(data.group_size - data.visitors.length, 0);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Add Group Members
        </h2>
        <p className="text-sm text-gray-600">
          Add members to the group ({data.visitors.length}/{data.group_size})
        </p>
      </header>

      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-4">
        <FormField
          label="Name"
          required
          value={tempVisitor.name}
          onChange={(v) => setTempVisitor((s) => ({ ...s, name: v }))}
          placeholder="Visitor name"
        />

        <FormField
          label="Email"
          required
          type="email"
          value={tempVisitor.email}
          onChange={(v) => setTempVisitor((s) => ({ ...s, email: v }))}
          placeholder="visitor@example.com"
        />

        <FormField
          label="Phone Number"
          required
          value={tempVisitor.phone}
          onChange={(v) => setTempVisitor((s) => ({ ...s, phone: v }))}
          placeholder="Enter phone number"
        />

        <FormField
          label="Purpose"
          required
          value={tempVisitor.purpose}
          onChange={(v) => setTempVisitor((s) => ({ ...s, purpose: v }))}
          placeholder="Reason for visit"
        />

        <FormField
          label="ID Type"
          as="select"
          value={tempVisitor.id_type}
          onChange={(v) => setTempVisitor((s) => ({ ...s, id_type: v }))}
          options={idTypes.map((t) => ({
            value: t,
            label: t,
          }))}
        />

        <FormField
          label="ID Number"
          required
          value={tempVisitor.id_number}
          onChange={(v) => setTempVisitor((s) => ({ ...s, id_number: v }))}
          placeholder="ID number"
        />

        <Button
          variant="primary"
          size="md"
          onClick={handleAdd}
          disabled={!isValidVisitor || remaining === 0}
          startIcon={<Plus size={16} />}
          className="w-full"
        >
          Add Visitor
        </Button>
      </div>

      {data.visitors.length > 0 ? (
        <div className="space-y-2">
          {data.visitors.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {i + 1}. {v.name}
                </p>
                <p className="text-sm text-gray-600">
                  {v.email} • {v.phone}
                </p>
                <p className="text-xs text-gray-500">
                  {v.id_type}: {v.id_number}
                </p>
                <p className="text-xs italic text-gray-500">
                  Purpose: {v.purpose}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => removeVisitor(v.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-gray-500">No visitors added yet</p>
      )}

      {remaining > 0 && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-600">
          Please add {remaining} more visitor(s) to match the group size
        </p>
      )}
    </div>
  );
}

interface IdentityInfoData {
  id_type: string;
  id_number: string;
  preregistered: boolean;
}

interface StepIdentityProps {
  data: IdentityInfoData;
  updateField: <K extends keyof IdentityInfoData>(
    field: K,
    value: IdentityInfoData[K]
  ) => void;
  idTypes: string[];
}

export function StepIdentity({
  data,
  updateField,
  idTypes,
}: StepIdentityProps) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Identity Information
        </h2>
        <p className="text-sm text-gray-600">
          Provide valid identification details
        </p>
      </header>

      <div className="space-y-4">
        <FormField
          label="ID Type"
          required
          as="select"
          value={data.id_type}
          onChange={(v) => updateField("id_type", v)}
          options={idTypes.map((type) => ({
            value: type,
            label: type,
          }))}
        />

        <FormField
          label="ID Number"
          required
          value={data.id_number}
          onChange={(v) => updateField("id_number", v)}
          placeholder="Enter ID number"
        />

        <label className="flex cursor-pointer items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={data.preregistered}
            onChange={(e) => updateField("preregistered", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-gray-700">
            This is a preregistered visitor
          </span>
        </label>
      </div>
    </div>
  );
}

interface Facility {
  id: number;
  name: string;
}

interface StepFacilitiesData {
  facilities: number[];
}

interface StepFacilitiesProps {
  data: StepFacilitiesData;
  toggleFacility: (id: number) => void;
}

export function StepFacilities({ data, toggleFacility }: StepFacilitiesProps) {
  const [departments, setDepartments] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   apiCall("/department")
  //     .then((res) => setDepartments(res.departments || res))
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading facilities…</p>;
  }

  const options = departments.map((dept) => ({
    value: dept.id.toString(),
    text: dept.name,
  }));

  const selectedValues = data.facilities.map(String);

  const handleChange = (selected: string[]) => {
    const selectedIds = selected.map(Number);

    departments.forEach((dept) => {
      const isSelected = data.facilities.includes(dept.id);
      const shouldBeSelected = selectedIds.includes(dept.id);

      if (isSelected !== shouldBeSelected) {
        toggleFacility(dept.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Facility Access
        </h2>
        <p className="text-sm text-gray-600">
          Select the facilities the visitor will have access to
        </p>
      </header>

      {data.facilities.length > 0 && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Selected Facilities ({data.facilities.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {data.facilities.map((id) => {
              const dept = departments.find((d) => d.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
                >
                  <Check size={12} className="mr-1" />
                  {dept?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <MultiSelect
        label="Facilities"
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder="Select facilities"
      />
    </div>
  );
}

interface TimingData {
  time_from: string;
  time_to: string;
}

interface VisitSummary {
  name: string;
  email: string;
  idType: string;
  facilities: string[]; // names, not count
}

interface StepTimingProps {
  data: TimingData;
  updateField: <K extends keyof TimingData>(
    field: K,
    value: TimingData[K]
  ) => void;
  summary: VisitSummary;
}

export function StepTiming({ data, updateField, summary }: StepTimingProps) {
  const isInvalidTime =
    data.time_from &&
    data.time_to &&
    new Date(data.time_to) <= new Date(data.time_from);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Visit Timing
        </h2>
        <p className="text-sm text-gray-600">
          Specify the duration of the visit
        </p>
      </header>

      <div className="space-y-4">
        <FormField
          label="Start Time"
          required
          type="datetime-local"
          value={data.time_from}
          onChange={(v) => updateField("time_from", v)}
          error={isInvalidTime}
          hint={
            isInvalidTime ? "Start time must be before end time" : undefined
          }
        />

        <FormField
          label="End Time"
          required
          type="datetime-local"
          value={data.time_to}
          onChange={(v) => updateField("time_to", v)}
          error={isInvalidTime}
        />
      </div>

      <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Calendar size={16} />
          Visit Summary
        </h3>

        <div className="space-y-3 text-sm">
          <SummaryRow
            icon={<User size={14} />}
            label="Name"
            value={summary.name}
          />

          <SummaryRow
            icon={<Mail size={14} />}
            label="Email"
            value={summary.email}
          />

          <SummaryRow
            icon={<IdCard size={14} />}
            label="ID Type"
            value={summary.idType}
          />

          <SummaryRow
            icon={<Building2 size={14} />}
            label="Facilities"
            value={
              summary.facilities.length > 0
                ? summary.facilities.join(", ")
                : "None"
            }
          />

          <SummaryRow
            icon={<Clock size={14} />}
            label="Duration"
            value={
              data.time_from && data.time_to
                ? `${new Date(data.time_from).toLocaleString()} → ${new Date(
                    data.time_to
                  ).toLocaleString()}`
                : "Not specified"
            }
          />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="max-w-[60%] text-right font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

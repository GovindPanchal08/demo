import React from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import PhoneInput from "../../../components/form/group-input/PhoneInput";

type FieldType = "text" | "email" | "number" | "date" | "time" | "password";

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: FieldType;
  value?: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  as?: "input" | "select" | "multiselect" | "phone";
  isTextarea?: boolean;

  rows?: number;
  options?: SelectOption[];

  min?: string;
  max?: string;

  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  type = "text",
  as = "input",
  value,
  onChange,
  placeholder,
  isTextarea = false,
  options = [],
  rows = 3,
  min,
  max,
  disabled = false,
  error = false,
  hint,
}) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      {isTextarea && (
        <TextArea
          rows={rows}
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          hint={hint}
        />
      )}

      {!isTextarea && as === "select" && (
        <Select
          options={options}
          placeholder={placeholder}
          defaultValue={value as string}
          onChange={onChange}
        />
      )}

      {!isTextarea && as === "multiselect" && (
        <MultiSelect
          label={label}
          options={options.map((o) => ({
            value: o.value,
            text: o.label,
          }))}
          value={value as string[]}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}

      {!isTextarea && as === "phone" && (
        <PhoneInput
          countries={[
            { code: "US", label: "+1" },
            { code: "IN", label: "+91" },
          ]}
          onChange={onChange}
        />
      )}

      {!isTextarea && as === "input" && (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          error={error}
          hint={hint}
        />
      )}
    </div>
  );
};

export default FormField;

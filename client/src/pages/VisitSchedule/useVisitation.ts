import { useState, useCallback, useMemo } from "react";
import { FORM_CONFIGS } from "./config/formConfig";
import { STEP_CONFIGS } from "./config/stepConfig";

interface Visitor {
  id: number;
  [key: string]: any;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  group_name: string;
  group_leader_email: string;
  group_size: number;
  visitors: Visitor[];
  id_type: string;
  id_number: string;
  id_scan_s3: string;
  photo_s3: string;
  preregistered: boolean;
  time_from: string;
  time_to: string;
  facilities: string[];
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  purpose: "",
  group_name: "",
  group_leader_email: "",
  group_size: 1,
  visitors: [],
  id_type: "Aadhar",
  id_number: "",
  id_scan_s3: "",
  photo_s3: "",
  preregistered: true,
  time_from: "",
  time_to: "",
  facilities: [],
};

const VISIT_TYPE_OPTIONS = [
  { value: "SINGLE", label: "Single Visit" },
  { value: "GROUP", label: "Group Visit" },
];

interface ValidationMap {
  [key: string]: (data: FormData) => boolean;
}

const VALIDATION_RULES: ValidationMap = {
  visitor_info: (f) => !!(f.name && f.email && f.phone && f.purpose),
  group_info: (f) =>
    !!(f.group_name && f.group_leader_email && f.group_size > 0),
  visitor_list: (f) => f.visitors.length >= parseInt(f.group_size.toString()),
  identity: (f) => !!(f.id_type && f.id_number),
  facilities: () => true,
  timing: (f) => !!(f.time_from && f.time_to),
};

export const useVisitation = (visitType: string = "SINGLE") => {
  const [currentVisitType, setCurrentVisitType] = useState(visitType);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const config = useMemo(
    () => FORM_CONFIGS[currentVisitType],
    [currentVisitType]
  );

  const steps = useMemo(() => {
    return config.steps.map((key: string, idx: number) => ({
      key,
      number: idx + 1,
      ...STEP_CONFIGS[key],
    }));
  }, [config.steps]);

  const totalSteps = useMemo(() => steps.length, [steps.length]);
  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleFacility = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(id)
        ? prev.facilities.filter((f) => f !== id)
        : [...prev.facilities, id],
    }));
  }, []);

  const addVisitor = useCallback((visitor: any) => {
    setFormData((prev) => ({
      ...prev,
      visitors: [...prev.visitors, { ...visitor, id: Date.now() }],
    }));
  }, []);

  const removeVisitor = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      visitors: prev.visitors.filter((v) => v.id !== id),
    }));
  }, []);

  const validateStep = useCallback(
    (stepNumber: number): boolean => {
      const stepKey = config.steps[stepNumber - 1];
      const validator = VALIDATION_RULES[stepKey];
      return validator ? validator(formData) : false;
    },
    [formData, config.steps]
  );

  const getStepErrorMessage = useCallback(
    (stepNumber: number): string => {
      const stepKey = config.steps[stepNumber - 1];
      const stepName = STEP_CONFIGS[stepKey]?.title || stepKey;
      return `Please fill all required fields for ${stepName}`;
    },
    [config.steps]
  );

  const nextStep = useCallback(
    (onError: (msg: string) => void): boolean => {
      if (validateStep(currentStep)) {
        setCurrentStep((s) => Math.min(s + 1, totalSteps));
        return true;
      } else {
        onError(getStepErrorMessage(currentStep));
        return false;
      }
    },
    [currentStep, validateStep, totalSteps, getStepErrorMessage]
  );

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const buildSingleVisitPayload = useCallback(() => {
    const f = formData;
    return {
      type: "single",
      visitor: {
        name: f.name,
        email: f.email,
        phone: f.phone,
        purpose: f.purpose,
        id_type: f.id_type,
        id_number: f.id_number,
        id_scan_s3: f.id_scan_s3 || null,
        photo_s3: f.photo_s3 || null,
      },
      visit: {
        time_from: new Date(f.time_from).toISOString(),
        time_to: new Date(f.time_to).toISOString(),
        facilities: f.facilities,
        preregistered: f.preregistered,
        status: "pending",
      },
    };
  }, [formData]);

  const buildGroupVisitPayload = useCallback(() => {
    const f = formData;
    return {
      type: "group",
      group: {
        name: f.group_name,
        lead_email: f.group_leader_email,
        size: parseInt(f.group_size.toString()),
      },
      visitors: f.visitors.map(({ id, ...v }) => v),
      visit: {
        time_from: new Date(f.time_from).toISOString(),
        time_to: new Date(f.time_to).toISOString(),
        facilities: f.facilities,
        preregistered: f.preregistered,
        status: "pending",
      },
    };
  }, [formData]);

  const buildPayload = useCallback(() => {
    return currentVisitType === "SINGLE"
      ? buildSingleVisitPayload()
      : buildGroupVisitPayload();
  }, [currentVisitType, buildSingleVisitPayload, buildGroupVisitPayload]);

  const handleTypeChange = useCallback((value: string) => {
    setCurrentVisitType(value);
    setCurrentStep(1);
    setFormData((prev) => ({
      ...prev,
      group_name: "",
      group_leader_email: "",
      group_size: 1,
      visitors: [],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
  }, []);

  const getSummary = useCallback(() => {
    return {
      name: formData.name || formData.group_name,
      email: formData.email || formData.group_leader_email,
      idType: formData.id_type,
      facilities: formData.facilities.length,
    };
  }, [formData]);

  return {
    // State
    currentVisitType,
    currentStep,
    totalSteps,
    formData,
    steps,

    // Handlers
    updateField,
    toggleFacility,
    addVisitor,
    removeVisitor,
    nextStep,
    prevStep,
    handleTypeChange,
    resetForm,

    // Utilities
    validateStep,
    getStepErrorMessage,
    buildPayload,
    getSummary,
    VISIT_TYPE_OPTIONS,
  };
};

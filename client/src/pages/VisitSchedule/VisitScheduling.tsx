import {
  StepFacilities,
  StepGroupInfo,
  StepIdentity,
  StepTiming,
  StepVisitorInfo,
  StepVisitorList,
} from "./components/step";
import { Stepper } from "./components/Stepper";
import { StepFooter } from "./components/StepFooter";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { useVisitation } from "./useVisitation";
import PageHeader from "../../components/common/PageBreadCrumb";

export default function VisitForm() {
  const idTypes = ["Aadhar", "PAN", "Passport", "Driver's License"];
  const canCreate = true;
  const onCreate = async () => {};
  const onError = (msg) => alert(msg);
  const {
    currentVisitType,
    currentStep,
    totalSteps,
    formData,
    steps,
    updateField,
    toggleFacility,
    addVisitor,
    removeVisitor,
    nextStep,
    prevStep,
    handleTypeChange,
    resetForm,
    validateStep,
    buildPayload,
    getSummary,
    VISIT_TYPE_OPTIONS,
  } = useVisitation("SINGLE");

  const handleNextStep = () => {
    nextStep(onError);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateStep(totalSteps)) {
      return onError("Please fill all required fields");
    }
    try {
      const payload = buildPayload();
      const created = await onCreate(payload);
      if (created) {
        resetForm();
      }
    } catch (err) {
      onError(err.message || "Failed to create visit");
    }
  };

  const renderStep = () => {
    const stepKey = steps[currentStep - 1].key;

    const stepComponentProps = {
      visitor_info: (
        <StepVisitorInfo data={formData} updateField={updateField} />
      ),
      group_info: <StepGroupInfo data={formData} updateField={updateField} />,
      visitor_list: (
        <StepVisitorList
          data={formData}
          addVisitor={addVisitor}
          removeVisitor={removeVisitor}
          idTypes={idTypes}
        />
      ),
      identity: (
        <StepIdentity
          data={formData}
          updateField={updateField}
          idTypes={idTypes}
        />
      ),
      facilities: (
        <StepFacilities data={formData} toggleFacility={toggleFacility} />
      ),
      timing: (
        <StepTiming
          data={formData}
          updateField={updateField}
          summary={getSummary()}
        />
      ),
    };

    return stepComponentProps[stepKey] || null;
  };

  return (
    <>
      <PageHeader
        title="Forms"
        description="Create and manage dynamic forms"
        showBack
        backTo="/dashboard"
        showSearch
        onSearchChange={(v) => console.log(v)}
        filters={
          <select className="h-9 rounded-lg border px-3 text-sm dark:bg-gray-dark">
            <option>All</option>
            <option>Active</option>
            <option>Archived</option>
          </select>
        }
        actionLabel="Add Form"
        onActionClick={() => console.log("Add clicked")}
      />

      <div className="max-w-xs mb-2  ">
        <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Visit Type
        </Label>

        <Select
          options={VISIT_TYPE_OPTIONS}
          defaultValue={currentVisitType}
          onChange={handleTypeChange}
          className={currentStep > 1 ? "pointer-events-none opacity-60" : ""}
        />
      </div>

      <Stepper steps={steps} currentStep={currentStep} />
      <form className="bg-white border rounded-2xl mt-6" onSubmit={submitForm}>
        <div className="p-8">{renderStep()}</div>
        <StepFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={prevStep}
          onNext={handleNextStep}
          canSubmit={canCreate}
        />
      </form>
    </>
  );
}

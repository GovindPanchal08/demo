import React from "react";
import { Check } from "lucide-react";

interface Step {
  key: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  number: number;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between space-x-6 w-full">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isPending = currentStep < step.number;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${isCompleted ? "bg-blue-600 border-blue-600" : ""}
                  ${isActive ? "border-blue-600" : "border-gray-300"}
                  ${isPending ? "bg-white border-gray-300" : ""}`}
              >
                {isCompleted ? (
                  <Check className="text-white" />
                ) : (
                  <Icon
                    className={`${
                      isActive ? "text-blue-600" : "text-gray-400"
                    } transition-all duration-200`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-semibold 
                  ${isActive ? "text-blue-600" : "text-gray-500"} 
                  ${isCompleted ? "text-blue-600" : ""}`}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 
                  ${isCompleted ? "bg-blue-600" : "bg-gray-300"}
                  ${isPending && "bg-gray-300"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

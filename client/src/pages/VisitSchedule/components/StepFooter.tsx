import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Button from "../../../components/ui/button/Button"; // adjust path as needed

interface StepFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  canSubmit: boolean;
}

export const StepFooter: React.FC<StepFooterProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  canSubmit,
}) => {
  return (
    <div className="px-8 py-4 bg-gray-50 border-t flex justify-between">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="md"
        onClick={onPrev}
        disabled={currentStep === 1}
        startIcon={<ChevronLeft size={16} />}
      >
        Previous
      </Button>

      {/* Next / Submit Button */}
      {currentStep < totalSteps ? (
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          endIcon={<ChevronRight size={16} />}
        >
          Next
        </Button>
      ) : (
        canSubmit && (
          <Button
            variant="primary"
            size="md"
            type="submit"
            startIcon={<Check size={16} />}
          >
            Create Visit
          </Button>
        )
      )}
    </div>
  );
};

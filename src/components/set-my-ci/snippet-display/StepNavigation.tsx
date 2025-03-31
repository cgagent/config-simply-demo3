
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPreviousStep: () => void;
  onNextStep: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onPreviousStep, onNextStep }) => {
  return (
    <div className="flex justify-end mt-4">
      <Button
        variant="outline"
        className="mr-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
        onClick={onPreviousStep}
      >
        Back
      </Button>
      <Button
        className="bg-gray-800 text-white hover:bg-gray-700"
        onClick={onNextStep}
      >
        Continue
      </Button>
    </div>
  );
};

export default StepNavigation;

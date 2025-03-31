
import { useState } from 'react';

export type CIType = 'github' | 'other' | null;

export interface UseCISetupStateProps {
  initialStep?: number;
  initialCI?: CIType;
  initialPackages?: string[];
}

export function useCISetupState({
  initialStep = 1,
  initialCI = null,
  initialPackages = []
}: UseCISetupStateProps = {}) {
  const [selectedCI, setSelectedCI] = useState<CIType>(initialCI);
  const [selectedPackages, setSelectedPackages] = useState<string[]>(initialPackages);
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Function to handle CI selection
  const handleCISelection = (ciType: string) => {
    setSelectedCI(ciType as CIType);
    setCurrentStep(2);
  };

  // Function to handle package manager selection
  const handlePackageSelection = (packageType: string) => {
    setSelectedPackages(prevSelected => {
      if (prevSelected.includes(packageType)) {
        // Remove if already selected
        return prevSelected.filter(p => p !== packageType);
      } else {
        // Add if not already selected
        return [...prevSelected, packageType];
      }
    });
  };

  // Function to continue to step 3
  const handleContinueToStep3 = () => {
    setCurrentStep(3);
  };

  // Function to continue to step 4 (completion)
  const handleContinueToStep4 = () => {
    setCurrentStep(4);
  };

  // Add a function to go to previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Format selected packages as text
  const getSelectedPackagesText = () => {
    return selectedPackages.join(', ');
  };

  // Check if we can proceed to next step
  const canProceedToNextStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedCI !== null;
      case 2:
        return selectedPackages.length > 0;
      default:
        return true;
    }
  };

  return {
    selectedCI,
    selectedPackages,
    currentStep,
    handleCISelection,
    handlePackageSelection,
    handleContinueToStep3,
    handleContinueToStep4,
    handlePreviousStep,
    getSelectedPackagesText,
    canProceedToNextStep
  };
}

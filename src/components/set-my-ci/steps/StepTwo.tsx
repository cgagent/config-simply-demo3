
import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { CIButtonGroup } from '../CIButtonGroup';
import { CIType } from '../hooks/useCISetupState';

interface StepTwoProps {
  ciName: string;
  onPackageSelection: (packageType: string) => void;
  selectedPackages: string[];
  onContinue: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ 
  ciName, 
  onPackageSelection, 
  selectedPackages, 
  onContinue 
}) => {
  return (
    <>
      <ChatMessage
        type="system"
        content={`You've selected ${ciName}. Great choice!`}
      />
      <ChatMessage
        type="system"
        content="Step 2: Select Package Managers\n\nChoose the package managers used in your project."
      />
      <ChatMessage
        type="button-group"
        content={
          <CIButtonGroup 
            options={[
              { id: 'docker', label: 'Docker' },
              { id: 'npm', label: 'npm' },
              { id: 'nuget', label: 'NuGet' },
              { id: 'python', label: 'Python' },
              { id: 'maven', label: 'Maven' },
              { id: 'go', label: 'Go' }
            ]}
            onSelect={onPackageSelection}
            multiSelect
            selectedOptions={selectedPackages}
            showContinueButton={selectedPackages.length > 0}
            onContinue={onContinue}
          />
        }
      />
    </>
  );
};

export default StepTwo;

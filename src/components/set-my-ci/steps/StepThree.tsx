
import React from 'react';
import { ChatMessage } from '../ChatMessage';
import CISnippetDisplay from '../snippet-display/CISnippetDisplay';
import { CIType } from '../hooks/useCISetupState';

interface StepThreeProps {
  packagesText: string;
  selectedCI: CIType;
  selectedPackages: string[];
  onNextStep: () => void;
  onPreviousStep: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ 
  packagesText, 
  selectedCI, 
  selectedPackages, 
  onNextStep,
  onPreviousStep
}) => {
  return (
    <>
      <ChatMessage
        type="system"
        content={`You've selected the following package managers: ${packagesText}.`}
      />
      <ChatMessage
        type="system"
        content="Step 3: Configuration Snippets\n\nBelow are the configuration snippets you can add to your workflow:"
      />
      <ChatMessage
        type="button-group"
        content={
          <CISnippetDisplay 
            selectedCI={selectedCI as 'github' | 'other'} 
            selectedPackages={selectedPackages}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
          />
        }
      />
    </>
  );
};

export default StepThree;

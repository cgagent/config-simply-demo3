
import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { CIButtonGroup } from '../CIButtonGroup';
import { CIType } from '../hooks/useCISetupState';

interface StepOneProps {
  onSelectCI: (ciType: string) => void;
  selectedCI: CIType;
}

const StepOne: React.FC<StepOneProps> = ({ onSelectCI, selectedCI }) => {
  return (
    <>
      <ChatMessage
        type="system"
        content="Step 1: Select CI System\n\nStreamline your CI pipeline with JFrog\nIntegrating JFrog with your CI system enhances security and improves artifact management."
      />
      <ChatMessage
        type="button-group"
        content={
          <CIButtonGroup 
            options={[
              { id: 'github', label: 'GitHub Actions', description: 'Configure JFrog with GitHub Actions' },
              { id: 'other', label: 'Other CI Systems', description: 'Circle CI, Jenkins, GitLab CI' }
            ]}
            onSelect={onSelectCI}
            selectedOptions={selectedCI ? [selectedCI] : []}
          />
        }
      />
    </>
  );
};

export default StepOne;


import React from 'react';
import { ChatMessage } from '../ChatMessage';
import { CIButtonGroup } from '../CIButtonGroup';

interface StepFourProps {
  onComplete: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ onComplete }) => {
  return (
    <>
      <ChatMessage
        type="system"
        content="Step 4: Implementation Guide\n\nFollow these steps to implement the JFrog integration in your CI system:"
      />
      <ChatMessage
        type="button-group"
        content={
          <CIButtonGroup 
            options={[
              { id: 'finish', label: 'Finish Setup', description: 'Complete the CI setup process' }
            ]}
            onSelect={onComplete}
          />
        }
      />
    </>
  );
};

export default StepFour;

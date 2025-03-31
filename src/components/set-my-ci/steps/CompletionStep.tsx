
import React from 'react';
import { ChatMessage } from '../ChatMessage';

const CompletionStep: React.FC = () => {
  return (
    <ChatMessage
      type="system"
      content="Setup completed successfully! Your CI system is now integrated with JFrog."
    />
  );
};

export default CompletionStep;

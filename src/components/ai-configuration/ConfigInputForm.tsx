import React from 'react';

interface ConfigInputFormProps {
  isProcessing: boolean;
  onSendMessage: () => void;
}

export const ConfigInputForm: React.FC<ConfigInputFormProps> = ({
  isProcessing,
  onSendMessage
}) => {
  return (
    <div className="p-3 border-t bg-background">
      {/* This div is kept as a container for styling consistency */}
    </div>
  );
};

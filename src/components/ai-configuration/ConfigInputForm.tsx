import React from 'react';

interface ConfigInputFormProps {
  input: string;
  setInput: (value: string) => void;
  isProcessing: boolean;
  onSendMessage: () => void;
}

export const ConfigInputForm: React.FC<ConfigInputFormProps> = ({
  input,
  setInput,
  isProcessing,
  onSendMessage
}) => {
  return (
    <div className="p-3 border-t bg-background">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full rounded-md border-gray-200 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSendMessage();
          }
        }}
        disabled={isProcessing}
      />
      <button
        onClick={onSendMessage}
        className="absolute bottom-5 right-5 bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isProcessing}
      >
        Send
      </button>
    </div>
  );
};

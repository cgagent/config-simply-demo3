import React from 'react';
import { MessageList } from './MessageList';
import { ConfigInputForm } from './ConfigInputForm';
import { useConfigChat } from './hooks/useConfigChat';
import { SelectableOptions } from './SelectableOptions';
import { FlyFrogIcon } from '@/components/ai-chat/FlyFrogIcon';
import { useNavigate } from 'react-router-dom';

interface AIConfigurationChatProps {
  repositoryName?: string;
}

const AIConfigurationChat: React.FC<AIConfigurationChatProps> = ({ repositoryName }) => {
  const navigate = useNavigate();
  
  const {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
  } = useConfigChat(repositoryName, (path) => navigate(path));

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-primary p-3">
        <h3 className="text-white font-medium flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <FlyFrogIcon />
          </div>
          JFrog AI Configuration Assistant
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <MessageList messages={messages} isProcessing={isProcessing} />
        
        {!isProcessing && options && options.length > 0 && (
          <SelectableOptions 
            options={options} 
            onSelectOption={handleSelectOption} 
          />
        )}
      </div>
      
      <ConfigInputForm 
        isProcessing={isProcessing}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default AIConfigurationChat;

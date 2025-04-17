import React from 'react';
import { MessageList } from './MessageList';
import { ConfigInputForm } from './ConfigInputForm';
import { useConfigChat } from '../ai-chat/hooks/useConfigChat';
import { SelectableOptions } from './SelectableOptions';
import { useNavigate } from 'react-router-dom';


interface AIConfigurationChatProps {
  repositoryName?: string;
  onMergeSuccess?: (repoName: string, packageType: string) => void;
}

const AIConfigurationChat: React.FC<AIConfigurationChatProps> = ({ 
  repositoryName,
  onMergeSuccess
}) => {
  const navigate = useNavigate();
  
  const {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
  } = useConfigChat(repositoryName, (path) => navigate(path), onMergeSuccess);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-5 rounded-md bg-gradient-to-b from-gray-100/95 to-white/95 border border-border/50 shadow-md dark:from-gray-850/95 dark:to-gray-900/95 dark:border-gray-800">
      {/* <div className="p-3 border-b border-none bg-none">
        <h3 className="text-blue-100 font-medium flex items-center space-glow">
          <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-full backdrop-blur-sm border border-blue-600/20 shadow-inner">
            <FlyFrogIcon className="w-5 h-5 text-blue-300" />
          </div>
          JFrog AI Configuration Assistant
        </h3>
      </div> */}
      
      <div className="flex-1 overflow-y-auto px-4 py-4 backdrop-blur-sm">
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

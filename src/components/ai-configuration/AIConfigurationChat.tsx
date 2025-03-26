import React from 'react';
import { MessageList } from './MessageList';
import { ConfigInputForm } from './ConfigInputForm';
import { useConfigChat } from './hooks/useConfigChat';
import { SelectableOptions } from './SelectableOptions';
import { FlyFrogIcon } from '@/components/ai-chat/FlyFrogIcon';
import { useNavigate } from 'react-router-dom';
import { Repository } from '@/types/repository';

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
    <div className="flex flex-col flex-1 bg-blue-950/30 border border-blue-800/30 rounded-lg overflow-hidden shadow-lg space-card">
      <div className="p-3 border-b border-blue-700/30">
        <h3 className="text-blue-100 font-medium flex items-center space-glow">
          <div className="w-8 h-8 mr-2 flex items-center justify-center bg-blue-100/30 rounded-full backdrop-blur-sm border border-blue-600/20 shadow-inner">
            <FlyFrogIcon className="w-5 h-5 text-blue-300" />
          </div>
          JFrog AI Configuration Assistant
        </h3>
      </div>
      
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


import React, { useEffect } from 'react';
import { MessageList } from './MessageList';
import { ConfigInputForm } from './ConfigInputForm';
import { useConfigChat } from './hooks/useConfigChat';
import { SelectableOptions } from './SelectableOptions';
import { FlyFrogIcon } from '@/components/ai-chat/FlyFrogIcon';
import { useNavigate } from 'react-router-dom';
import { Repository } from '@/types/repository';
import { CIChatFlow } from './CIChatFlow';

interface AIConfigurationChatProps {
  repositoryName?: string;
  onMergeSuccess?: (repoName: string, packageType: string) => void;
  initialMode?: 'ci-setup' | 'general';
}

const AIConfigurationChat: React.FC<AIConfigurationChatProps> = ({ 
  repositoryName,
  onMergeSuccess,
  initialMode = 'general'
}) => {
  const navigate = useNavigate();
  
  const {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
    addBotMessage,
    addUserMessage
  } = useConfigChat(repositoryName, (path) => navigate(path), onMergeSuccess);

  // Initialize the CI flow controller
  const ciChatFlow = CIChatFlow({
    addBotMessage,
    addUserMessage,
    onComplete: () => console.log("CI setup completed")
  });

  // Start the CI setup flow if initialMode is ci-setup
  useEffect(() => {
    if (initialMode === 'ci-setup' && messages.length === 0) {
      setTimeout(() => {
        addUserMessage("I need help setting up CI with JFrog");
        ciChatFlow.startCIFlow();
      }, 500);
    }
  }, [initialMode]);

  // Add a function to handle special commands
  const handleSpecialCommands = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('set up ci') || 
        lowerMessage.includes('setup ci') || 
        lowerMessage.includes('ci setup') ||
        lowerMessage.includes('jfrog ci')) {
      
      // Start the CI setup flow
      setTimeout(() => {
        ciChatFlow.startCIFlow();
      }, 300);
      
      return true;
    }
    
    return false;
  };

  // Wrap the original handleSendMessage to intercept special commands
  const handleMessageWithCISupport = (message: string) => {
    // Check if this is a special CI setup command
    if (!handleSpecialCommands(message)) {
      // If not, proceed with normal message handling
      handleSendMessage(message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-5 rounded-md bg-gradient-to-b from-gray-100/95 to-white/95 border border-border/50 shadow-md dark:from-gray-850/95 dark:to-gray-900/95 dark:border-gray-800">
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
        onSendMessage={handleMessageWithCISupport}
      />
    </div>
  );
};

export default AIConfigurationChat;

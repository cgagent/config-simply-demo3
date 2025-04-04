import React from 'react';
import { InitialChatScreen } from './InitialChatScreen';
import { ConversationScreen } from './ConversationScreen';
import { useMessageHandler } from './hooks/useMessageHandler';
import { useTypingAnimation } from './hooks/useTypingAnimation';
import { useInitialInput } from './hooks/useInitialInput';
import { useAutoSendMessage } from './hooks/useAutoSendMessage';
import { useResetDetection } from './hooks/useResetDetection';
import { useChatStateNotifier } from './hooks/useChatStateNotifier';
import { Message } from './constants';

interface AIChatProps {
  onChatStateChange?: (isChatActive: boolean) => void;
  initialInputValue?: string;
  clearInitialInputValue?: () => void;
  shouldSendMessage?: boolean;
  clearShouldSendMessage?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  onChatStateChange, 
  initialInputValue = '', 
  clearInitialInputValue,
  shouldSendMessage = false,
  clearShouldSendMessage
}) => {
  const {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    handleSecurityRemediation,
    showCIConfig,
    repository,
    resetMessages
  } = useMessageHandler();
  
  // Reset detection when navigating
  const { lastProcessedInputRef, processingRef } = useResetDetection({ resetMessages });
  
  // Automatic message sending
  useAutoSendMessage({
    shouldSendMessage,
    inputValue,
    isProcessing,
    clearShouldSendMessage,
    handleSendMessage
  });
  
  // Handle initial input value
  const { hasInitialInput } = useInitialInput({
    initialInputValue,
    clearInitialInputValue,
    setInputValue,
    isProcessing
  });
  
  // Notify parent about chat state changes
  useChatStateNotifier({ 
    messages, 
    onChatStateChange 
  });
  
  // Handle typing animation
  const { getAnimatedMessages } = useTypingAnimation({ 
    messages,
    typingSpeed: 3 // Increased typing speed (lower number = faster)
  });
  
  // Get messages with typing animation applied
  const displayMessages = getAnimatedMessages();
  
  // Initial state (no messages yet and no initial input)
  if (messages.length === 0 && !hasInitialInput) {
    return (
      <InitialChatScreen
        isProcessing={isProcessing}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onSelectQuery={handleSelectQuery}
      />
    );
  }

  // Chat state (after user has sent at least one message or when there's initial input)
  return (
    <ConversationScreen
      messages={displayMessages}
      isProcessing={isProcessing}
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSendMessage={handleSendMessage}
      onSelectQuery={handleSelectQuery}
      onSelectOption={handleSecurityRemediation}
      showCIConfig={showCIConfig}
      repository={repository}
    />
  );
};

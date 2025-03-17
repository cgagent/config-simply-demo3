
import React, { useState, useEffect } from 'react';
import { InitialChatScreen } from './InitialChatScreen';
import { ConversationScreen } from './ConversationScreen';
import { useMessageHandler } from './hooks/useMessageHandler';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIChatProps {
  onChatStateChange?: (isChatActive: boolean) => void;
  initialInputValue?: string;
  clearInitialInputValue?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  onChatStateChange, 
  initialInputValue = '', 
  clearInitialInputValue 
}) => {
  const {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    showCIConfig,
    repository
  } = useMessageHandler();

  // Listen for initial input value changes
  useEffect(() => {
    if (initialInputValue && initialInputValue.trim() !== '') {
      setInputValue(initialInputValue);
      // Automatically send the message if it comes from a statistics panel
      handleSendMessage(initialInputValue);
      // Clear the initial value to prevent re-sending
      if (clearInitialInputValue) {
        clearInitialInputValue();
      }
    }
  }, [initialInputValue, clearInitialInputValue]);

  // Notify parent component about chat state changes
  useEffect(() => {
    if (onChatStateChange) {
      onChatStateChange(messages.length > 0);
    }
  }, [messages.length, onChatStateChange]);

  // Function to handle going back to home view
  const handleBackToHome = () => {
    if (onChatStateChange) {
      onChatStateChange(false);
    }
  };

  // Initial state (no messages yet)
  if (messages.length === 0) {
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

  // Chat state (after user has sent at least one message)
  return (
    <>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button 
                  onClick={handleBackToHome}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Back to Home
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ConversationScreen
        messages={messages}
        isProcessing={isProcessing}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onSelectQuery={handleSelectQuery}
        showCIConfig={showCIConfig}
        repository={repository}
      />
    </>
  );
};

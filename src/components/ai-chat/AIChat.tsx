import React, { useState, useEffect, useRef } from 'react';
import { InitialChatScreen } from './InitialChatScreen';
import { ConversationScreen } from './ConversationScreen';
import { useMessageHandler } from './hooks/useMessageHandler';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    showCIConfig,
    repository,
    resetMessages
  } = useMessageHandler();
  
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isAnimatingResponse, setIsAnimatingResponse] = useState(false);
  const typingSpeed = 15; // milliseconds per character
  const typingTimerRef = useRef<number | null>(null);
  const latestMessageRef = useRef<string | null>(null);
  // Track last processed input
  const lastProcessedInputRef = useRef<string>('');
  // Processing flag to prevent loops
  const processingRef = useRef(false);
  // Reset detection flag
  const resetDetectedRef = useRef(false);

  // Handle chat reset requests
  useEffect(() => {
    if (location.state && location.state.resetChat && !resetDetectedRef.current) {
      console.log("AIChat detected reset state, clearing messages");
      resetDetectedRef.current = true;
      resetMessages();
      lastProcessedInputRef.current = '';
      processingRef.current = false;
      
      // Reset detection flag after delay to allow future resets
      setTimeout(() => {
        resetDetectedRef.current = false;
      }, 200);
    }
  }, [location.state, resetMessages]);

  // Handle the shouldSendMessage flag
  useEffect(() => {
    if (shouldSendMessage && inputValue && !isProcessing && clearShouldSendMessage) {
      console.log("Auto-sending message:", inputValue);
      handleSendMessage(inputValue);
      clearShouldSendMessage();
    }
  }, [shouldSendMessage, inputValue, isProcessing, handleSendMessage, clearShouldSendMessage]);

  // Simulate typing effect for AI responses
  const simulateTypingResponse = (text: string) => {
    setIsAnimatingResponse(true);
    setDisplayedResponse('');
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedResponse(prev => prev + text.charAt(currentIndex));
        currentIndex++;
        typingTimerRef.current = window.setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsAnimatingResponse(false);
      }
    };
    
    typeNextCharacter();
  };

  // Clean up typing animation on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // Listen for new bot messages to animate them
  useEffect(() => {
    const botMessages = messages.filter(m => m.role === 'bot');
    if (botMessages.length > 0) {
      const latestBotMessage = botMessages[botMessages.length - 1];
      
      // Only animate if this is a new message we haven't seen yet
      if (latestBotMessage.content !== latestMessageRef.current) {
        latestMessageRef.current = latestBotMessage.content;
        simulateTypingResponse(latestBotMessage.content);
      }
    }
  }, [messages]);

  // Handle initialInputValue changes safely
  useEffect(() => {
    // Skip if empty, already processing, or already processed this exact input
    if (!initialInputValue || 
        initialInputValue.trim() === '' || 
        processingRef.current ||
        initialInputValue === lastProcessedInputRef.current) {
      return;
    }
    
    console.log("Processing new initial input value:", initialInputValue);
    
    // Set processing flag to prevent re-entrant processing
    processingRef.current = true;
    
    // Update lastProcessed reference
    lastProcessedInputRef.current = initialInputValue;
    
    // Update input value
    setInputValue(initialInputValue);
    
    // Clear initialInputValue to prevent reprocessing
    if (clearInitialInputValue) {
      setTimeout(() => {
        clearInitialInputValue();
        // Release processing lock after sufficient delay
        setTimeout(() => {
          processingRef.current = false;
        }, 500);
      }, 200);
    } else {
      // Release processing lock after sufficient delay if no clearInitialInputValue function
      setTimeout(() => {
        processingRef.current = false;
      }, 700);
    }
  }, [initialInputValue, clearInitialInputValue, setInputValue]);

  // Notify parent about chat state changes
  useEffect(() => {
    if (onChatStateChange) {
      onChatStateChange(messages.length > 0);
    }
  }, [messages.length, onChatStateChange]);

  // We want to show the conversation screen immediately if there are messages,
  // or if the parent has explicitly set isChatActive to true via initialInputValue
  const hasInitialInput = initialInputValue && initialInputValue.trim() !== '';
  
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

  // Create a modified messages array with the animated content for the last bot message
  const displayMessages = [...messages];
  if (isAnimatingResponse && displayMessages.length > 0) {
    // Find the last bot message
    for (let i = displayMessages.length - 1; i >= 0; i--) {
      if (displayMessages[i].role === 'bot') {
        // Replace its content with the currently animated content
        displayMessages[i] = {
          ...displayMessages[i],
          content: displayedResponse
        };
        break;
      }
    }
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
      showCIConfig={showCIConfig}
      repository={repository}
    />
  );
};



import { useEffect, useRef } from 'react';

interface UseAutoSendMessageProps {
  shouldSendMessage: boolean;
  inputValue: string;
  isProcessing: boolean;
  clearShouldSendMessage?: () => void;
  handleSendMessage: (content: string) => void;
}

export const useAutoSendMessage = ({
  shouldSendMessage,
  inputValue,
  isProcessing,
  clearShouldSendMessage,
  handleSendMessage
}: UseAutoSendMessageProps) => {
  const hasAutoSentRef = useRef(false);
  
  useEffect(() => {
    // Only attempt to auto-send when shouldSendMessage is true,
    // input has value, and we're not already processing
    if (shouldSendMessage && inputValue && !isProcessing && !hasAutoSentRef.current) {
      console.log("Auto-sending message:", inputValue);
      
      // Set flag to prevent duplicate sends
      hasAutoSentRef.current = true;
      
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        handleSendMessage(inputValue);
        
        // Clear the flag after a delay to allow for next message
        setTimeout(() => {
          if (clearShouldSendMessage) {
            clearShouldSendMessage();
          }
          hasAutoSentRef.current = false;
        }, 100);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Reset flag when shouldSendMessage becomes false
    if (!shouldSendMessage) {
      hasAutoSentRef.current = false;
    }
  }, [shouldSendMessage, inputValue, isProcessing, clearShouldSendMessage, handleSendMessage]);
};


import { useState, useRef, useEffect } from 'react';
import { Message } from '../constants';

export interface UseTypingAnimationProps {
  messages: Message[];
  typingSpeed?: number;
}

export const useTypingAnimation = ({ messages, typingSpeed = 3 }: UseTypingAnimationProps) => {
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isAnimatingResponse, setIsAnimatingResponse] = useState(false);
  const typingTimerRef = useRef<number | null>(null);
  const latestMessageRef = useRef<string | null>(null);
  const animationInProgressRef = useRef(false);

  // Simulate typing effect for AI responses with faster speed
  const simulateTypingResponse = (text: string) => {
    if (animationInProgressRef.current) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    }
    
    animationInProgressRef.current = true;
    setIsAnimatingResponse(true);
    setDisplayedResponse('');
    
    // For faster typing, we can process multiple characters per iteration
    const charsPerIteration = 3; 
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        // Add multiple characters at once for faster typing
        const endIndex = Math.min(currentIndex + charsPerIteration, text.length);
        const nextChars = text.substring(currentIndex, endIndex);
        setDisplayedResponse(prev => prev + nextChars);
        currentIndex = endIndex;
        typingTimerRef.current = window.setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsAnimatingResponse(false);
        animationInProgressRef.current = false;
      }
    };
    
    typeNextCharacter();
  };

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

  // Clean up typing animation on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      animationInProgressRef.current = false;
    };
  }, []);

  // Create a modified messages array with the animated content for the last bot message
  const getAnimatedMessages = () => {
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
    return displayMessages;
  };

  return {
    isAnimatingResponse,
    getAnimatedMessages
  };
};

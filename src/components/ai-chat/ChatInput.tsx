
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  isInitialState?: boolean;
  value?: string;
  setValue?: (value: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isProcessing,
  isInitialState = false,
  value = '',
  setValue
}) => {
  const [input, setInput] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const staticPlaceholder = "Ask me anything...";
  
  const rotatingPlaceholders = [
    "Set up your CI with FlyFrog...",
    "Show you what packages are being used in your organization...",
    "Find a public package...",
    "See the malicious packages that blocked by FlyFrog...",
    "Check your data consumption or storage in the last month...",
    "Create an Sbom report for you..."
  ];
  
  // Update local input when value prop changes
  useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
  }, [value]);
  
  // Effect for textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  // Effect for animated typing/deleting placeholders
  useEffect(() => {
    if (!isInitialState) return;
    
    const prefix = "Ask FlyFrog to ";
    
    if (isTyping) {
      if (currentSuggestion.length < rotatingPlaceholders[currentIndex].length) {
        const timer = setTimeout(() => {
          setCurrentSuggestion(rotatingPlaceholders[currentIndex].substring(0, currentSuggestion.length + 1));
        }, 30); // Typing speed reduced from 80ms to 30ms
        return () => clearTimeout(timer);
      } else {
        // Done typing, wait before starting to delete - reduced from 2000ms to 1000ms
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      if (currentSuggestion.length > 0) {
        const timer = setTimeout(() => {
          setCurrentSuggestion(currentSuggestion.substring(0, currentSuggestion.length - 1));
        }, 20); // Deleting speed reduced from 50ms to 20ms
        return () => clearTimeout(timer);
      } else {
        // Done deleting, move to next suggestion and start typing again
        const nextIndex = (currentIndex + 1) % rotatingPlaceholders.length;
        setCurrentIndex(nextIndex);
        setIsTyping(true);
        return undefined;
      }
    }
  }, [currentSuggestion, isTyping, currentIndex, isInitialState, rotatingPlaceholders]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    // Update parent's state if setValue is provided
    if (setValue) {
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    // Update parent's state if setValue is provided
    if (setValue) {
      setValue(newValue);
    }
  };

  const placeholder = isInitialState 
    ? `Ask FlyFrog to ${currentSuggestion}`
    : staticPlaceholder;

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isProcessing}
        className={`pr-12 resize-none overflow-hidden min-h-[56px] font-normal ${isInitialState ? 'text-base' : 'text-sm'}`}
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={!input.trim() || isProcessing}
        onClick={handleSendMessage}
        variant="ghost"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

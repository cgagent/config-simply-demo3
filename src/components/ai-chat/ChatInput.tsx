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
    "set up your CI with JFrog",
    "show you what are the most common packages in your organization in the last...",
    "search for any package or CVE",
    "identify what packages are vulnerable and used in your organization",
    "check what was your data consumption in the last..."
  ];
  
  useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
  }, [value]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  useEffect(() => {
    if (!isInitialState) return;
    
    const prefix = "Ask JFrog to ";
    
    if (isTyping) {
      if (currentSuggestion.length < rotatingPlaceholders[currentIndex].length) {
        const timer = setTimeout(() => {
          setCurrentSuggestion(rotatingPlaceholders[currentIndex].substring(0, currentSuggestion.length + 1));
        }, 30);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      if (currentSuggestion.length > 0) {
        const timer = setTimeout(() => {
          setCurrentSuggestion(currentSuggestion.substring(0, currentSuggestion.length - 1));
        }, 20);
        return () => clearTimeout(timer);
      } else {
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
    if (setValue) {
      setValue(newValue);
    }
  };

  const placeholder = isInitialState 
    ? `Ask JFrog to ${currentSuggestion}`
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
        className={`pr-12 resize-none overflow-hidden min-h-[70px] font-normal bg-gray-100 dark:bg-gray-850 ${isInitialState ? 'text-base' : 'text-sm'}`}
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


import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isProcessing
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={isProcessing}
        className="pr-12 resize-none overflow-hidden min-h-[56px]"
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

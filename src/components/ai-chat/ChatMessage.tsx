
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-white" : "bg-primary/10 text-primary"
      )}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">{isUser ? 'You' : 'AI Assistant'}</p>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

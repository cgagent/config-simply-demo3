
import React, { useRef, useEffect } from 'react';
import { Message } from './types';
import { MessageItem } from './MessageItem';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-5 rounded-md",
        "bg-gradient-to-b from-background/95 to-background/90 border border-border/50 shadow-md"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-primary text-center font-medium bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
            No messages yet. Start typing to begin.
          </p>
        </div>
      )}
      <div className="space-y-5">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

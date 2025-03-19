
import React, { useRef, useEffect } from 'react';
import { ChatMessage, Message } from './ChatMessage';
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
        "flex-1 overflow-y-auto p-4 space-y-5 rounded-lg",
        "bg-gradient-to-b from-gray-100/95 to-white/95 border border-border/50 shadow-md",
        "dark:from-gray-850/95 dark:to-gray-900/95 dark:border-gray-800/80"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-primary text-center font-medium bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 dark:bg-primary/10">
            Start a conversation to get package information
          </p>
        </div>
      )}
      <div className="space-y-5">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

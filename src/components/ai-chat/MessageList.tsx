import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from './constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

// Thinking animation component with three dots
const ThinkingAnimation = () => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <motion.div 
        className="h-3 w-3 bg-primary/70 rounded-full"
        animate={{ scale: [0.6, 1, 0.6] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: 0 }}
      />
      <motion.div 
        className="h-3 w-3 bg-primary/70 rounded-full"
        animate={{ scale: [0.6, 1, 0.6] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div 
        className="h-3 w-3 bg-primary/70 rounded-full"
        animate={{ scale: [0.6, 1, 0.6] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  isProcessing?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      className={cn(
        "flex-1 overflow-y-auto py-4 space-y-5 rounded-md",
        "bg-gradient-to-b from-gray-100/95 to-white/95 border border-border/50 shadow-md",
        "dark:from-gray-850/95 dark:to-gray-900/95 dark:border-gray-800"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-primary text-center text-sm font-medium bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 dark:bg-primary/10">
            Ask anything to get started
          </p>
        </div>
      )}
      <div className="px-4 space-y-5">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Thinking animation when processing */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3"
          >
            <div className="flex gap-3 p-4 rounded-lg shadow-md border bg-card border-border/60 mr-8 rounded-tl-none">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-foreground">
                    AI Assistant
                  </p>
                </div>
                <div className="py-2">
                  <ThinkingAnimation />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </motion.div>
  );
};


import React from 'react';
import { Bot, User, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types';
import { CodeBlock } from './CodeBlock';
import { motion } from 'framer-motion';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { toast } = useToast();
  const isBot = message.role === 'bot';

  const copyToClipboard = (text: string) => {
    // Extract code blocks
    const codeBlockMatch = text.match(/```yaml([\s\S]*?)```/);
    const codeToCopy = codeBlockMatch ? codeBlockMatch[1].trim() : text;
    
    navigator.clipboard.writeText(codeToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Configuration snippet copied successfully",
      });
    });
  };

  return (
    <motion.div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`max-w-[85%] rounded-lg p-4 shadow-sm border ${
          isBot 
            ? 'bg-muted mr-8 border-muted-foreground/20 rounded-tl-none' 
            : 'bg-primary text-primary-foreground ml-8 border-primary-foreground/20 rounded-tr-none'
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center mb-2">
          <div className={`p-1 rounded-full ${isBot ? 'bg-muted-foreground/10' : 'bg-primary-foreground/20'}`}>
            {isBot ? (
              <Bot className="w-4 h-4 mr-1" />
            ) : (
              <User className="w-4 h-4 mr-1" />
            )}
          </div>
          <span className="text-xs font-medium ml-2">
            {isBot ? 'FlyFrog Assistant' : 'You'}
          </span>
          {isBot && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-8 w-8 p-0 rounded-full hover:bg-muted-foreground/10"
              onClick={() => copyToClipboard(message.content)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <div className="whitespace-pre-wrap">
          {message.content.includes('```') ? (
            <CodeBlock 
              content={message.content} 
              onCopy={copyToClipboard} 
            />
          ) : (
            message.content
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

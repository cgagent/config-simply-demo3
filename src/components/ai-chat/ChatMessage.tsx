import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from './constants';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import CVECard from '../CVECard';
import { SelectableOptions } from '../ai-configuration/SelectableOptions';
import { ChatOption } from '@/components/shared/types';
import { securityRemediationOptions } from './config/constants/securityConstants';

interface ChatMessageProps {
  message: Message;
  onSelectOption?: (option: ChatOption) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectOption }) => {
  const isUser = message.role === 'user';
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully",
      });
    });
  };

  return (
   
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-3"
    >
      <motion.div
        className={cn(
          "flex gap-3 p-4 rounded-lg shadow-md border backdrop-blur-sm",
          isUser 
            ? "bg-blue-800/30 text-white border-blue-700/30 ml-8 rounded-tr-none" 
            : "bg-blue-950/30 border-blue-800/30 mr-8 rounded-tl-none"
        )}
      >
   
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "bg-blue-600 text-white" : "bg-blue-900 text-blue-200 ring-2 ring-blue-500/30"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">
              {isUser ? 'You' : 'JFrog Assistant'}
            </div>
            {!isUser && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-blue-300/70 hover:text-blue-300 hover:bg-blue-800/30"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-blue-900/30 prose-pre:text-blue-100 prose-code:text-blue-300">
            <ReactMarkdown 
              className="whitespace-pre-wrap"
              components={{
                code: ({ children, ...props }) => {
                  const match = /language-(\w+)/.exec(props.className || '');
                  const isInline = !match;
                  return (
                    <code className={isInline ? 'prose-code' : props.className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          
      {message.content.includes("One package with risks was detected") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="space-y-4"
        >
          <CVECard
            cveId="CVE-2024-39338"
            description="This CVE is enriched by JFrog Research and provides more accurate information"
            severity="critical"
            packageName="axios"
            packageVersion="1.5.1"
            fixVersion="1.7.4"
            cveRelation="Non-Transitive"
            cvssScore="7.5 (v3)"
            epssScore="0.09%"
            percentile="22.52%"
          />
          {onSelectOption && (
            <div className="mt-4">
              <SelectableOptions 
                options={securityRemediationOptions}
                onSelectOption={onSelectOption}
              />
            </div>
          )}
        </motion.div>
      )}
 
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  // The issue might be with how ReactMarkdown is handling whitespace
  // Try preserving whitespace by adding a className with white-space: pre-wrap
  // or by using the rehypeRaw plugin if needed
  // Another approach is to check if the message content is being trimmed before it reaches this component
};

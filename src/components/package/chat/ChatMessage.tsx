
import React from 'react';
import { Bot, User, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { toast } = useToast();
  const isUser = message.role === 'user';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Text copied successfully",
      });
    });
  };

  // Helper function to format package entries in SBOM reports
  const formatPackageData = (content: string) => {
    if (content.includes('SBOM report')) {
      const parts = content.split(/\n\n(?=Package:)/);
      return (
        <>
          <p className="mb-6 text-sm font-medium">{parts[0]}</p>
          <div className="flex flex-col space-y-6">
            {parts.slice(1).map((packageData, index) => {
              const lines = packageData.split('\n');
              const packageName = lines[0].replace('Package: ', '');
              const version = lines[1].replace('Version: ', '');
              const license = lines[2].replace('License: ', '');
              
              return (
                <div key={index} className="bg-muted/40 rounded-md p-5 border shadow-sm w-full">
                  <div className="font-bold text-md mb-4">{packageName}</div>
                  
                  <div className="mb-2">
                    <div className="text-muted-foreground font-medium mb-1">Version:</div>
                    <div>{version}</div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-muted-foreground font-medium mb-1">License:</div>
                    <div>{license}</div>
                  </div>
                  
                  {lines.length > 3 && lines[3].includes('Dependencies:') && (
                    <div className="mt-4">
                      <div className="text-muted-foreground font-medium mb-2">Dependencies:</div>
                      <div className="pl-2">
                        {lines.slice(4).map((dep, i) => (
                          <div key={i} className="mb-1">{dep}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    }
    
    return content.split('\n').map((line, i) => {
      if (line.startsWith('• ')) {
        return <p key={i} className="mb-1 ml-2">• {line.substring(2)}</p>;
      } else if (line.match(/^\d+\./)) {
        return <p key={i} className="mb-1 ml-2">{line}</p>;
      } else if (line.includes('**')) {
        return (
          <p key={i} className="mb-1">
            {line.split('**').map((segment, j) => 
              j % 2 === 1 ? <strong key={j}>{segment}</strong> : segment
            )}
          </p>
        );
      } else {
        return <p key={i} className="mb-1">{line}</p>;
      }
    });
  };

  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`max-w-[85%] rounded-lg p-4 shadow-sm border ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-8 border-primary-foreground/20 rounded-tr-none' 
            : 'bg-muted mr-8 border-muted-foreground/20 rounded-tl-none'
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center mb-2">
          <div className={`p-1 rounded-full ${isUser ? 'bg-primary-foreground/20' : 'bg-muted-foreground/10'}`}>
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
          <span className="text-xs font-medium ml-2">
            {isUser ? 'You' : 'Assistant'}
          </span>
          {!isUser && (
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
          {formatPackageData(message.content)}
        </div>
      </motion.div>
    </motion.div>
  );
};

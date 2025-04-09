import React from 'react';
import { Message, isSecurityAlertMessage, isPackageInfoMessage, isCIConfigMessage, isActionOptionsMessage } from '../types/messageTypes';
import { ChatOption } from '../../ai-configuration/types';
import { cn } from '@/lib/utils';
import { Bot, User, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import CVECard from '../../CVECard';
import { SelectableOptions } from '../../ai-configuration/SelectableOptions';

interface MessageRendererProps {
  message: Message;
  onSelectOption?: (option: ChatOption) => void;
}

/**
 * Renders a text message with markdown support
 */
const TextMessageRenderer: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-blue-900/30 prose-pre:text-blue-100 prose-code:text-blue-300">
      <ReactMarkdown className="whitespace-pre-wrap">
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

/**
 * Renders a security alert message with CVE card and remediation options
 */
const SecurityAlertRenderer: React.FC<{ 
  message: Message; 
  onSelectOption?: (option: ChatOption) => void;
}> = ({ message, onSelectOption }) => {
  if (!isSecurityAlertMessage(message)) {
    return <TextMessageRenderer message={message} />;
  }

  // Convert severity string to the expected type
  const severity = message.cveData.severity.toLowerCase() as "critical" | "high" | "medium" | "low";

  return (
    <div className="space-y-4">
      <TextMessageRenderer message={message} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-4"
      >
        <CVECard
          cveId={message.cveData.cveId}
          description={message.cveData.description}
          severity={severity}
          packageName={message.cveData.packageName}
          packageVersion={message.cveData.packageVersion}
          fixVersion={message.cveData.fixVersion}
          cveRelation={message.cveData.cveRelation}
          cvssScore={message.cveData.cvssScore}
          epssScore={message.cveData.epssScore}
          percentile={message.cveData.percentile}
        />
        
        {onSelectOption && (
          <div className="mt-4">
            <SelectableOptions 
              options={message.remediationOptions}
              onSelectOption={onSelectOption}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Renders a package information message
 */
const PackageInfoRenderer: React.FC<{ message: Message }> = ({ message }) => {
  if (!isPackageInfoMessage(message)) {
    return <TextMessageRenderer message={message} />;
  }

  return (
    <div className="space-y-4">
      <TextMessageRenderer message={message} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-blue-900/30 p-4 rounded-lg"
      >
        <h3 className="text-lg font-medium mb-2">Package Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Name:</div>
          <div>{message.packageData.name}</div>
          
          <div className="font-medium">Version:</div>
          <div>{message.packageData.version}</div>
          
          <div className="font-medium">Latest Version:</div>
          <div>{message.packageData.latestVersion}</div>
          
          <div className="font-medium">License:</div>
          <div>{message.packageData.license}</div>
        </div>
        
        {message.packageData.dependencies && Object.keys(message.packageData.dependencies).length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Dependencies</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(message.packageData.dependencies).map(([name, version]) => (
                <React.Fragment key={name}>
                  <div className="font-medium">{name}:</div>
                  <div>{version}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Renders a CI configuration message
 */
const CIConfigRenderer: React.FC<{ message: Message }> = ({ message }) => {
  if (!isCIConfigMessage(message)) {
    return <TextMessageRenderer message={message} />;
  }

  return (
    <div className="space-y-4">
      <TextMessageRenderer message={message} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-blue-900/30 p-4 rounded-lg"
      >
        <h3 className="text-lg font-medium mb-2">CI Configuration</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Tool:</div>
          <div>{message.configData.tool}</div>
          
          <div className="font-medium">Package Manager:</div>
          <div>{message.configData.packageManager}</div>
        </div>
        
        {message.configData.configExample && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Configuration Example</h4>
            <pre className="bg-blue-950/50 p-3 rounded-md overflow-x-auto">
              <code>{message.configData.configExample}</code>
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Renders an action options message
 */
const ActionOptionsRenderer: React.FC<{ 
  message: Message; 
  onSelectOption?: (option: ChatOption) => void;
}> = ({ message, onSelectOption }) => {
  if (!isActionOptionsMessage(message)) {
    return <TextMessageRenderer message={message} />;
  }

  return (
    <div className="space-y-4">
      <TextMessageRenderer message={message} />
      
      {onSelectOption && (
        <div className="mt-4">
          <SelectableOptions 
            options={message.options}
            onSelectOption={onSelectOption}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Main message renderer component that determines which renderer to use based on message type
 */
export const MessageRenderer: React.FC<MessageRendererProps> = ({ message, onSelectOption }) => {
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
          
          {isSecurityAlertMessage(message) ? (
            <SecurityAlertRenderer message={message} onSelectOption={onSelectOption} />
          ) : isPackageInfoMessage(message) ? (
            <PackageInfoRenderer message={message} />
          ) : isCIConfigMessage(message) ? (
            <CIConfigRenderer message={message} />
          ) : isActionOptionsMessage(message) ? (
            <ActionOptionsRenderer message={message} onSelectOption={onSelectOption} />
          ) : (
            <TextMessageRenderer message={message} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}; 
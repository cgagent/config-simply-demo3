import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, Copy, Package } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message as ConstantMessage } from './config/constants/chatConstants';
import { Message as TypeMessage, isPackageTableMessage } from './types/messageTypes';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import CVECard from '../CVECard';
import { SelectableOptions } from '../ai-configuration/SelectableOptions';
import { ChatOption } from '@/components/shared/types';
import { securityRemediationOptions } from './config/constants/securityConstants';
import { MessageRenderer } from './display/MessageRenderer';
import { DistributePackageModal } from '../DistributePackageModal';

// Extended message type that includes options
interface MessageWithOptions extends ConstantMessage {
  options?: ChatOption[];
}

interface ChatMessageProps {
  message: ConstantMessage | TypeMessage;
  onSelectOption?: (option: ChatOption) => void;
  className?: string;
}

// Helper to check if message content contains our specific package table
const hasPackageTable = (content: string): boolean => {
  return content.includes('| Type | Package Name |') && 
         content.includes('Latest Packages');
};

// Helper to parse the package table rows from markdown
const parsePackageTable = (content: string): Array<{
  type: string;
  name: string;
  version: string;
  created: string;
  versions: string;
  status?: string;
}> => {
  const rows: Array<{
    type: string;
    name: string;
    version: string;
    created: string;
    versions: string;
    status?: string;
  }> = [];
  
  // Find all rows in the table
  const lines = content.split('\n');
  let inTable = false;
  
  for (const line of lines) {
    // Skip header rows
    if (line.startsWith('| Type | Package Name |')) {
      inTable = true;
      continue;
    }
    
    if (inTable && line.trim().startsWith('|') && line.includes('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '');
      if (cells.length >= 5) {
        // Detect status badges
        let status = '';
        if (cells[2].includes('✅')) status = 'passed';
        else if (cells[2].includes('⚠️')) status = 'warning';
        else if (cells[2].includes('❌')) status = 'failed';
        
        rows.push({
          type: cells[0].trim(),
          name: cells[1].trim().replace(/\*\*/g, ''), // Remove markdown bold
          version: cells[2].trim().replace(/`/g, '').split(' ')[0], // Remove markdown code
          created: cells[3].trim(),
          versions: cells[4].trim(),
          status
        });
      }
    }
    
    // End of table
    if (inTable && !line.trim().startsWith('|') && line.trim() !== '') {
      inTable = false;
    }
  }
  
  return rows;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectOption, className }) => {
  const isUser = message.role === 'user';
  const { toast } = useToast();
  const [distributeModalOpen, setDistributeModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [distributedPackages, setDistributedPackages] = useState<Set<string>>(new Set());
  
  // Debug logging to see what messages we're receiving
  console.log("ChatMessage rendering with message:", {
    id: message.id,
    role: message.role,
    type: (message as Record<string, unknown>).type || 'unknown',
    hasTypeField: 'type' in message,
    isPackageTable: 'type' in message && (message as Record<string, unknown>).type === 'package-table',
    hasPackages: 'packages' in message,
    content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
  });
  
  // Check if the message contains a package table
  const containsPackageTable = !isUser && hasPackageTable(message.content);
  const packageTableRows = containsPackageTable ? parsePackageTable(message.content) : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully",
      });
    });
  };

  const handleDistributeClick = (packageName: string) => {
    setSelectedPackage(packageName);
    setDistributeModalOpen(true);
  };

  const handleDistributePackage = () => {
    // Add the package to the set of distributed packages
    setDistributedPackages(prev => {
      const newSet = new Set(prev);
      newSet.add(selectedPackage);
      return newSet;
    });
    
    toast({
      title: "Package Distribution Initiated",
      description: `${selectedPackage} will be distributed to external repositories.`,
      duration: 3000,
    });
  };

  // Check if the message has options property (for action options messages)
  const hasOptions = 'options' in message && Array.isArray((message as MessageWithOptions).options);
  
  // Check if this is a package table message - look for type field and packages array
  const isPackageTable = 'type' in message && message.type === 'package-table' && 'packages' in message;

  const getExternalDistributedStatus = (row: { 
    type?: string; 
    version?: string; 
    status?: string;
    name?: string;
  }, index: number) => {
    // Check if this package was distributed by the user
    if (row.name && distributedPackages.has(row.name)) {
      return true;
    }
    
    // Apply specific rules to get a mix of Yes and No values
    
    // 1. Only specific docker packages are distributed
    if (row.type === 'docker' && row.name && (
      row.name.includes('api') || 
      (row.name.includes('service') && index % 2 === 0)
    )) {
      return true;
    } 
    
    // 2. Only some packages with higher version numbers are distributed
    if (row.version && row.version.startsWith('3.')) {
      return true;
    }
    
    // 3. Only first and third package with "passed" status are distributed
    if (row.status === 'passed' && (index === 0 || index === 2)) {
      return true;
    }
    
    // Default to false for most packages
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("px-3", className)}
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
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-foreground">
              {isUser ? 'You' : 'JFrog Assistant'}
            </p>
            {!isUser && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Use direct package table rendering when we've detected a package table */}
          {containsPackageTable && packageTableRows.length > 0 ? (
            <div>
              <p className="mb-4">Here are the latest packages published in your organization:</p>
              
              <div className="bg-blue-900/40 rounded-lg overflow-hidden border border-blue-700/30 shadow-md mb-2">
                <div className="bg-blue-800/40 px-4 py-2 border-b border-blue-700/30">
                  <div className="text-sm text-white font-medium flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-400" />
                    Latest Published Packages
                  </div>
                </div>
                <div className="p-2">
                  <div className="overflow-hidden rounded-lg border border-blue-800/50 shadow-sm">
                    <table className="w-full border-collapse bg-blue-950/20">
                      <thead className="bg-blue-900/50">
                        <tr>
                          <th className="py-2 px-3 text-left font-medium text-blue-100 border-b border-blue-800/30">Type</th>
                          <th className="py-2 px-3 text-left font-medium text-blue-100 border-b border-blue-800/30">Package Name</th>
                          <th className="py-2 px-3 text-left font-medium text-blue-100 border-b border-blue-800/30">Latest Version</th>
                          <th className="py-2 px-3 text-left font-medium text-blue-100 border-b border-blue-800/30">First Created</th>
                          <th className="py-2 px-3 text-center font-medium text-blue-100 border-b border-blue-800/30">Versions</th>
                          <th className="py-2 px-3 text-center font-medium text-blue-100 border-b border-blue-800/30">Externaly Distributed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-800/20">
                        {packageTableRows.map((row, index) => (
                          <tr key={index} className="hover:bg-blue-800/20 transition-colors">
                            <td className="py-3 px-3 flex items-center">
                              <span className="mr-2">
                                {row.type === 'docker' && <img src="/lovable-uploads/docker.png" className="h-4 w-4" alt="Docker" />}
                                {row.type === 'npm' && <img src="/lovable-uploads/npm.png" className="h-4 w-4" alt="NPM" />}
                                {row.type === 'python' && <img src="/lovable-uploads/python.png" className="h-4 w-4" alt="Python" />}
                                {row.type === 'go' && <img src="/lovable-uploads/go.png" className="h-4 w-4" alt="Go" />}
                                {row.type === 'maven' && <img src="/lovable-uploads/maven.png" className="h-4 w-4" alt="Maven" />}
                                {!['docker', 'npm', 'python', 'go', 'maven'].includes(row.type) && 
                                  <Package className="h-4 w-4 text-blue-400" />}
                              </span>
                              <span>{row.type}</span>
                            </td>
                            <td className="py-3 px-3 font-medium text-blue-100">{row.name}</td>
                            <td className="py-3 px-3">
                              <code className="px-2 py-1 bg-blue-900/30 rounded text-blue-200">{row.version}</code>
                              {row.status === 'passed' && <span className="ml-2 text-green-400">✅</span>}
                              {row.status === 'warning' && <span className="ml-2 text-yellow-400">⚠️</span>}
                              {row.status === 'failed' && <span className="ml-2 text-red-400">❌</span>}
                            </td>
                            <td className="py-3 px-3">{row.created}</td>
                            <td className="py-3 px-3 text-center">{row.versions}</td>
                            <td className="py-3 px-3 text-center">
                              {getExternalDistributedStatus(row, index) ? (
                                <span className="text-green-400">Yes</span>
                              ) : (
                                <button 
                                  onClick={() => handleDistributeClick(row.name)}
                                  className="text-red-400 hover:text-red-300 hover:underline cursor-pointer transition-colors"
                                >
                                  No
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Distribution Modal */}
              <DistributePackageModal 
                isOpen={distributeModalOpen}
                onClose={() => setDistributeModalOpen(false)}
                packageName={selectedPackage}
                onDistribute={handleDistributePackage}
              />
            </div>
          ) : isPackageTable ? (
            <MessageRenderer message={message as unknown as TypeMessage} onSelectOption={onSelectOption} />
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-blue-900/30 prose-pre:text-blue-100 prose-code:text-blue-300">
              <ReactMarkdown 
                className={cn(
                  "whitespace-pre-wrap",
                  isUser ? "text-2xl font-bold" : ""
                )}
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
            
              {/* Handle security alert messages */}
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
              
              {/* Handle action options messages */}
              {hasOptions && onSelectOption && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-4"
                >
                  <SelectableOptions 
                    options={(message as MessageWithOptions).options || []}
                    onSelectOption={onSelectOption}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {distributeModalOpen && (
        <DistributePackageModal
          isOpen={distributeModalOpen}
          onClose={() => setDistributeModalOpen(false)}
          onConfirm={handleDistributePackage}
          packageName={selectedPackage}
        />
      )}
    </motion.div>
  );
};

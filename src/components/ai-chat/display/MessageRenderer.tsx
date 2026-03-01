import React, { useState } from 'react';
import { Message, isSecurityAlertMessage, isPackageInfoMessage, isCIConfigMessage, isActionOptionsMessage, isPackageTableMessage } from '../types/messageTypes';
import { ChatOption } from '@/components/shared/types';
import { cn } from '@/lib/utils';
import { Bot, User, Copy, Package } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import CVECard from '../../CVECard';
import { SelectableOptions } from '../../ai-configuration/SelectableOptions';
import { formatDistanceToNow } from 'date-fns';
import { DistributePackageModal } from '../../DistributePackageModal';

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
 * Renders a package table message
 */
const PackageTableRenderer: React.FC<{ 
  message: Message; 
  onSelectOption?: (option: ChatOption) => void;
}> = ({ message, onSelectOption }) => {
  const [distributeModalOpen, setDistributeModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [distributedPackages, setDistributedPackages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!isPackageTableMessage(message) || !message.packages) {
    return <TextMessageRenderer message={message} />;
  }

  const handleDistributeClick = (packageName: string) => {
    setSelectedPackage(packageName);
    setDistributeModalOpen(true);
  };

  const handleDistributePackage = () => {
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
    
    setDistributeModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-800/30">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Version</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">First Created</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Versions</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-blue-300 uppercase tracking-wider">Externally Distributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-800/30">
            {message.packages.map((pkg, index) => (
              <tr key={pkg.name + index} className="hover:bg-blue-800/10">
                <td className="px-4 py-2 text-sm text-blue-200">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {pkg.type === 'docker' && <img src="/lovable-uploads/docker.png" className="h-4 w-4" alt="Docker" />}
                      {pkg.type === 'npm' && <img src="/lovable-uploads/npm.png" className="h-4 w-4" alt="NPM" />}
                      {pkg.type === 'python' && <img src="/lovable-uploads/python.png" className="h-4 w-4" alt="Python" />}
                      {pkg.type === 'go' && <img src="/lovable-uploads/go.png" className="h-4 w-4" alt="Go" />}
                      {pkg.type === 'maven' && <img src="/lovable-uploads/maven.png" className="h-4 w-4" alt="Maven" />}
                      {!['docker', 'npm', 'python', 'go', 'maven'].includes(pkg.type) && 
                        <Package className="h-4 w-4 text-blue-400" />}
                    </span>
                    <span>{pkg.type || 'unknown'}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm font-medium text-blue-100">{pkg.name}</td>
                <td className="px-4 py-2 text-sm">
                  <code className="px-2 py-1 bg-blue-900/30 rounded text-blue-200">{pkg.version}</code>
                </td>
                <td className="px-4 py-2 text-sm text-blue-200">{pkg.firstCreated}</td>
                <td className="px-4 py-2 text-sm text-center text-blue-200">{pkg.versions}</td>
                <td className="px-4 py-2 text-sm text-center">
                  {distributedPackages.has(pkg.name) ? (
                    <span className="text-green-400">Yes</span>
                  ) : pkg.type === 'docker' && pkg.name === 'frontend-app' ? (
                    <span className="text-green-400">Yes</span>
                  ) : (
                    <button 
                      onClick={() => handleDistributeClick(pkg.name)}
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
      
      {message.options && onSelectOption && (
        <div className="mt-4">
          <SelectableOptions 
            options={message.options}
            onSelectOption={onSelectOption}
          />
        </div>
      )}

      {distributeModalOpen && (
        <DistributePackageModal
          isOpen={distributeModalOpen}
          onClose={() => setDistributeModalOpen(false)}
          packageName={selectedPackage}
          onDistribute={handleDistributePackage}
        />
      )}
    </div>
  );
};

/**
 * Main message renderer component that determines which renderer to use based on message type
 */
export const MessageRenderer: React.FC<MessageRendererProps> = ({ message, onSelectOption }) => {
  if (isPackageTableMessage(message)) {
    return <PackageTableRenderer message={message} onSelectOption={onSelectOption} />;
  }

  if (isSecurityAlertMessage(message)) {
    return <SecurityAlertRenderer message={message} onSelectOption={onSelectOption} />;
  }

  if (isPackageInfoMessage(message)) {
    return <PackageInfoRenderer message={message} />;
  }

  if (isCIConfigMessage(message)) {
    return <CIConfigRenderer message={message} />;
  }

  if (isActionOptionsMessage(message)) {
    return <ActionOptionsRenderer message={message} onSelectOption={onSelectOption} />;
  }

  return <TextMessageRenderer message={message} />;
}; 
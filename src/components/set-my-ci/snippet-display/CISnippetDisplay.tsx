
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import FullSnippetView from './FullSnippetView';
import BasicSnippetView from './BasicSnippetView';
import SnippetViewTabs from './SnippetViewTabs';
import StepNavigation from './StepNavigation';
import SnippetLoadingState from './SnippetLoadingState';
import { 
  generateJFrogSetupSnippet,
  generatePackageSpecificSnippets,
  generateFullGitHubSnippet,
  generateFullOtherCISnippet
} from './generators';

interface CISnippetDisplayProps {
  selectedCI: 'github' | 'other';
  selectedPackages: string[];
  onNextStep: () => void;
  onPreviousStep: () => void;
}

const CISnippetDisplay: React.FC<CISnippetDisplayProps> = ({
  selectedCI,
  selectedPackages,
  onNextStep,
  onPreviousStep
}) => {
  const [viewMode, setViewMode] = useState<'snippet' | 'full'>('snippet');
  const [snippets, setSnippets] = useState({
    basic: '',
    full: ''
  });
  const [isUpdating, setIsUpdating] = useState(true); // Set to true initially
  const { toast } = useToast();
  
  // Update snippets whenever selectedPackages changes
  useEffect(() => {
    setIsUpdating(true);
    
    // Small timeout to show the loading state
    const timer = setTimeout(() => {
      // Combine the setup and package specific into one basic snippet
      const setupSnippet = generateJFrogSetupSnippet(selectedCI);
      const packageSnippet = generatePackageSpecificSnippets(selectedPackages);
      
      setSnippets({
        basic: `${setupSnippet}\n${packageSnippet}`,
        full: selectedCI === 'github' 
          ? generateFullGitHubSnippet(selectedPackages) 
          : generateFullOtherCISnippet(selectedPackages)
      });
      setIsUpdating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedCI, selectedPackages]);

  // Copy to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: message,
      });
    });
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm animate-fadeIn">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Step 3: Configuration Snippet</h2>
        {isUpdating && (
          <div className="text-xs text-gray-500">
            Updating snippets...
          </div>
        )}
      </div>
      <p className="text-gray-700 text-xs mb-2">
        Here's the code snippet you need to add to your CI configuration.
      </p>
      
      <SnippetViewTabs viewMode={viewMode} setViewMode={setViewMode} />
      
      {isUpdating ? (
        <SnippetLoadingState />
      ) : viewMode === 'full' ? (
        <FullSnippetView 
          snippet={snippets.full} 
          onCopy={copyToClipboard} 
        />
      ) : (
        <BasicSnippetView 
          snippet={snippets.basic} 
          onCopy={copyToClipboard} 
        />
      )}
      
      <StepNavigation 
        onPreviousStep={onPreviousStep} 
        onNextStep={onNextStep} 
      />
    </div>
  );
};

export default CISnippetDisplay;

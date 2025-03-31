import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Copy, Code, FileText } from 'lucide-react';
import FullSnippetView from './FullSnippetView';
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
      
      <div className="border-b border-gray-200 pb-2 mb-3">
        <div className="flex gap-2 items-center">
          <div className="bg-gray-100 p-0.5 rounded-md flex text-xs">
            <button
              onClick={() => setViewMode('snippet')}
              className={`flex items-center px-3 py-1.5 rounded-md ${
                viewMode === 'snippet' 
                  ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Code size={14} className="mr-1.5" />
              Basic Snippet
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`flex items-center px-3 py-1.5 rounded-md ${
                viewMode === 'full' 
                  ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText size={14} className="mr-1.5" />
              Full Workflow
            </button>
          </div>
        </div>
      </div>
      
      {isUpdating ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : viewMode === 'full' ? (
        <FullSnippetView 
          snippet={snippets.full} 
          onCopy={copyToClipboard} 
        />
      ) : (
        <div className="bg-gray-50 rounded-md p-2 border border-gray-300 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs font-medium text-gray-800">Configuration snippet:</Label>
            <button 
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center"
              onClick={() => copyToClipboard(snippets.basic, "Snippet copied to clipboard")}
            >
              <Copy size={12} className="mr-1" />
              Copy
            </button>
          </div>
          <pre className="p-2 bg-gray-900 text-white rounded-md overflow-x-auto text-xs border border-gray-700 shadow-inner">
            {snippets.basic}
          </pre>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          className="mr-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
          onClick={onPreviousStep}
        >
          Back
        </Button>
        <Button
          className="bg-gray-800 text-white hover:bg-gray-700"
          onClick={onNextStep}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CISnippetDisplay;

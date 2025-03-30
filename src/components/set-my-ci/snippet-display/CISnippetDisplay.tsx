
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SetupSnippetTab from './SetupSnippetTab';
import PackageSnippetTab from './PackageSnippetTab';
import FullSnippetView from './FullSnippetView';
import { 
  generateJFrogSetupSnippet,
  generatePackageSpecificSnippets,
  generateFullGitHubSnippet,
  generateFullOtherCISnippet
} from './snippetGenerators';

interface CISnippetDisplayProps {
  selectedCI: 'github' | 'other';
  selectedPackages: string[];
  onNextStep: () => void;
  onPreviousStep: () => void;
}

const CISnippetDisplay: React.FC<CISnippetDisplayProps> = ({
  selectedCI,
  selectedPackages
}) => {
  const [showFullSnippet, setShowFullSnippet] = useState(false);
  const [snippets, setSnippets] = useState({
    setup: '',
    packageSpecific: '',
    full: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Update snippets whenever selectedPackages changes
  useEffect(() => {
    setIsUpdating(true);
    
    // Small timeout to show the loading state
    const timer = setTimeout(() => {
      setSnippets({
        setup: generateJFrogSetupSnippet(selectedCI),
        packageSpecific: generatePackageSpecificSnippets(selectedPackages),
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
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">Step 3: Configuration Snippet</h2>
        {isUpdating && (
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <LoaderCircle className="animate-spin h-3 w-3" />
            <span>Updating...</span>
          </div>
        )}
      </div>
      <p className="text-gray-700 text-xs mb-2">
        Here's the code snippet you need to add to your CI configuration.
      </p>
      
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="full-snippet"
            checked={showFullSnippet}
            onCheckedChange={setShowFullSnippet}
          />
          <Label htmlFor="full-snippet" className="text-xs font-medium text-gray-800">
            Show full workflow file
          </Label>
        </div>
      </div>
      
      {isUpdating ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : showFullSnippet ? (
        <FullSnippetView 
          snippet={snippets.full} 
          onCopy={copyToClipboard} 
        />
      ) : (
        <Tabs defaultValue="setup" className="mt-2">
          <TabsList className="mb-2 bg-gray-50 p-1 border border-gray-200">
            <TabsTrigger value="setup" className="text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-white">JFrog Setup</TabsTrigger>
            <TabsTrigger value="packages" className="text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-white">Package Config</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <SetupSnippetTab 
              snippet={snippets.setup} 
              onCopy={copyToClipboard} 
            />
          </TabsContent>
          
          <TabsContent value="packages">
            <PackageSnippetTab 
              snippet={snippets.packageSpecific} 
              onCopy={copyToClipboard} 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CISnippetDisplay;

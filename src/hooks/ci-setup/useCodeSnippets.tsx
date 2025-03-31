
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateJFrogSetupSnippet, 
  generatePackageSpecificSnippet, 
  generateFullGithubWorkflow,
  generateFullOtherCIWorkflow
} from '@/components/ci-setup/codeGenerators';

export const useCodeSnippets = (selectedCI: 'github' | 'other' | null) => {
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: description,
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard"
      });
    });
  };

  const generateSnippet = (packages: string[]) => {
    return `${generateJFrogSetupSnippet()}${generatePackageSpecificSnippet(packages)}`;
  };

  const generateFullWorkflow = (packages: string[]) => {
    if (selectedCI === 'github') {
      return generateFullGithubWorkflow(packages);
    } else {
      return generateFullOtherCIWorkflow(packages);
    }
  };

  return {
    showCodeSnippets,
    setShowCodeSnippets,
    copyToClipboard,
    generateSnippet,
    generateFullWorkflow
  };
};

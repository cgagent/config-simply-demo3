
import React, { useState } from 'react';
import { SnippetViewTabs, SnippetActionButtons, CodeDisplay, ApiKeyInstructions } from './snippet-components';

interface CodeSnippetsProps {
  selectedCI: 'github' | 'other' | null;
  selectedPackages: string[];
  onCopyToClipboard: (text: string, description: string) => void;
  generateSnippet: () => string;
  generateFullWorkflow: () => string;
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ 
  selectedCI, 
  selectedPackages, 
  onCopyToClipboard,
  generateSnippet,
  generateFullWorkflow
}) => {
  // State to toggle between snippet and full workflow
  const [viewMode, setViewMode] = useState<'snippet' | 'full'>('snippet');
  
  // Get the current content based on the selected view mode
  const getCurrentContent = () => {
    return viewMode === 'snippet' ? generateSnippet() : generateFullWorkflow();
  };

  // Get the appropriate filename based on the selected view mode and CI
  const getFileName = () => {
    if (viewMode === 'snippet') {
      return 'jfrog-setup.yml';
    } else {
      return selectedCI === 'github' ? 'github-workflow.yml' : 'jenkins-pipeline.groovy';
    }
  };
  
  // Function to handle file download
  const handleDownload = () => {
    const content = getCurrentContent();
    const filename = getFileName();
    
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Function to handle copy to clipboard
  const handleCopy = () => {
    const content = getCurrentContent();
    const description = viewMode === 'snippet' 
      ? "Setup snippet copied to clipboard" 
      : "Full workflow copied to clipboard";
    
    onCopyToClipboard(content, description);
  };

  return (
    <div className="mb-4 mt-2 space-y-4">
      <div className="bg-gray-800 rounded-md p-4 shadow-lg">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <SnippetViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            <SnippetActionButtons onCopy={handleCopy} onDownload={handleDownload} />
          </div>
          
          <CodeDisplay content={getCurrentContent()} />
        </div>
      </div>

      <ApiKeyInstructions selectedCI={selectedCI} />

      <p className="text-sm text-muted-foreground">
        Add these configurations to your CI workflow file to integrate with JFrog.
      </p>
    </div>
  );
};

export default CodeSnippets;

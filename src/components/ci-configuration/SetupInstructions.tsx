
import React from 'react';
import { CopyIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Repository } from '@/types/repository';

interface SetupInstructionsProps {
  repository?: Repository;
  selectedPackageTypes: string[];
  onCopy: (text: string, message: string) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({
  repository,
  selectedPackageTypes,
  onCopy,
  onNextStep,
  onPreviousStep
}) => {
  const generateSetupSnippet = () => {
    return `- name: Setup JFrog
  uses: jfrog/setup-jfrog@v1
  with:
    subdomain: acme`;
  };

  const generateFullSnippet = () => {
    const repoName = repository?.name || 'your-repository';
    
    return `name: CI Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup JFrog
        uses: jfrog/setup-jfrog@v1
        with:
          subdomain: acme
${selectedPackageTypes.includes('npm') ? 
`
      - name: Install npm dependencies
        run: npm install
      # Other npm build steps` : ''}
${selectedPackageTypes.includes('python') ? 
`
      - name: Install python dependencies
        run: pip install -r requirements.txt
      # Other python build steps` : ''}
${selectedPackageTypes.includes('docker') ? 
`
      - name: Build Docker image
        run: docker build -t ${repoName}:latest .
      # Other docker build steps` : ''}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Step 3: Add FlyFrog to your CI workflow</h2>
      
      <Tabs defaultValue="setup" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="setup">Setup Snippet</TabsTrigger>
          <TabsTrigger value="full">Full Workflow Example</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
          <div className="bg-muted rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Add this snippet to your workflow file:</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8" 
                onClick={() => onCopy(generateSetupSnippet(), "Setup snippet copied")}
              >
                <CopyIcon className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="p-4 bg-black text-white rounded-md overflow-x-auto text-sm">
              {generateSetupSnippet()}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="full" className="space-y-4">
          <div className="bg-muted rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Complete workflow example for {repository?.name || 'your repository'}:</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8" 
                onClick={() => onCopy(generateFullSnippet(), "Full workflow example copied")}
              >
                <CopyIcon className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="p-4 bg-black text-white rounded-md overflow-x-auto text-sm">
              {generateFullSnippet()}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" className="mr-2" onClick={onPreviousStep}>
          Back
        </Button>
        <Button onClick={onNextStep}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SetupInstructions;

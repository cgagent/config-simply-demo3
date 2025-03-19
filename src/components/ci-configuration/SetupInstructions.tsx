import React, { useMemo, useState } from 'react';
import { CopyIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Repository } from '@/types/repository';
import { Switch } from '@/components/ui/switch';

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
  const [showSideBySide, setShowSideBySide] = useState(true);
  
  const generateSetupSnippet = () => {
    return `- name: Setup JFrog
  uses: jfrog/setup-jfrog@v1
  with:
    subdomain: acme`;
  };

  const generateNpmWebAppSnippet = () => {
    const repoName = repository?.name || 'your-webapp';
    
    return `name: NPM Web App CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${repoName}-build
          path: build/

      - name: Deploy to staging
        if: github.event_name != 'pull_request'
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here`;
  };

  const generateNpmWebAppWithJFrogSnippet = () => {
    const repoName = repository?.name || 'your-webapp';
    
    return `name: NPM Web App CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

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

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${repoName}-build
          path: build/

      - name: Deploy to staging
        if: github.event_name != 'pull_request'
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here`;
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
  
  // Prepare diff view for npm workflow
  const diffView = useMemo(() => {
    const originalLines = generateNpmWebAppSnippet().split('\n');
    const modifiedLines = generateNpmWebAppWithJFrogSnippet().split('\n');
    
    // Find where the JFrog setup was added
    let jfrogStartIndex = -1;
    let jfrogEndIndex = -1;
    
    for (let i = 0; i < modifiedLines.length; i++) {
      if (modifiedLines[i].includes('Setup JFrog')) {
        jfrogStartIndex = i;
      }
      if (jfrogStartIndex >= 0 && modifiedLines[i].includes('subdomain: acme')) {
        jfrogEndIndex = i;
        break;
      }
    }
    
    // Calculate the offset in original workflow (since it has fewer lines)
    const beforeJFrogIndex = jfrogStartIndex - 1;
    
    if (showSideBySide) {
      // Side by side diff view
      return (
        <div className="grid grid-cols-2 gap-1 bg-black text-white rounded-md overflow-x-auto text-sm">
          {/* Header */}
          <div className="col-span-1 p-2 bg-slate-800 font-medium text-slate-300 border-b border-slate-700">
            Original Workflow
          </div>
          <div className="col-span-1 p-2 bg-slate-800 font-medium text-slate-300 border-b border-slate-700">
            Modified Workflow with JFrog
          </div>
          
          {/* Content */}
          <div className="col-span-1 border-r border-slate-700">
            {originalLines.map((line, index) => {
              // Add highlight for where the JFrog code should be inserted
              const isInsertPoint = index === beforeJFrogIndex;
              const bgClass = isInsertPoint ? "bg-blue-950" : "";
              const borderClass = isInsertPoint ? "border-b-2 border-dashed border-blue-500" : "";
              
              return (
                <div key={`orig-${index}`} className={`flex ${bgClass} ${borderClass}`}>
                  <span className="w-8 text-right select-none pr-2 opacity-50">
                    {index + 1}
                  </span>
                  <span className="flex-1 pl-2">{line}</span>
                  {isInsertPoint && (
                    <span className="pr-2 text-blue-400 font-bold">← Insert JFrog here</span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="col-span-1">
            {modifiedLines.map((line, index) => {
              // Determine if this line is part of the JFrog setup
              const isJFrogLine = index >= jfrogStartIndex && index <= jfrogEndIndex;
              
              // Set background and text colors based on whether it's a new line or not
              const bgClass = isJFrogLine ? "bg-green-950" : "";
              const textClass = isJFrogLine ? "text-green-300" : "text-white";
              const prefixClass = isJFrogLine ? "text-green-400 font-bold" : "opacity-50";
              
              return (
                <div key={`mod-${index}`} className={`flex ${bgClass}`}>
                  <span className={`w-8 text-right select-none pr-2 ${prefixClass}`}>
                    {index + 1}
                  </span>
                  {isJFrogLine && (
                    <span className="text-green-400 font-medium pr-1">+</span>
                  )}
                  <span className={`flex-1 ${isJFrogLine ? "pl-1" : "pl-2"} ${textClass}`}>{line}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      // Unified diff view
      return (
        <div className="bg-black text-white rounded-md overflow-x-auto text-sm">
          <div className="p-2 bg-slate-800 font-medium text-slate-300 border-b border-slate-700">
            Unified Diff View
          </div>
          
          {modifiedLines.map((line, index) => {
            // Determine if this line is part of the JFrog setup
            const isJFrogLine = index >= jfrogStartIndex && index <= jfrogEndIndex;
            
            // Set colors based on whether it's a new line or not
            const bgClass = isJFrogLine ? "bg-green-950" : "";
            const textClass = isJFrogLine ? "text-green-300" : "text-white";
            
            return (
              <div key={`unified-${index}`} className={`flex ${bgClass}`}>
                <span className="w-8 text-right select-none pr-2 opacity-50">
                  {index + 1}
                </span>
                {isJFrogLine ? (
                  <span className="text-green-400 font-medium pr-1">+</span>
                ) : (
                  <span className="w-4"></span>
                )}
                <span className={`flex-1 ${textClass}`}>{line}</span>
                {isJFrogLine && index === jfrogStartIndex && (
                  <span className="pr-2 text-green-400 italic">← JFrog integration added</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }, [repository, showSideBySide]);

  return (
    <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Step 3: Add FlyFrog to your CI workflow</h2>
      
      <Tabs defaultValue="diff" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="setup">Setup Snippet</TabsTrigger>
          <TabsTrigger value="diff">NPM Workflow Diff</TabsTrigger>
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
        
        <TabsContent value="diff" className="space-y-4">
          <div className="bg-muted rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Diff view of npm workflow changes:</Label>
              <div className="flex space-x-4 items-center">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="side-by-side"
                    checked={showSideBySide}
                    onCheckedChange={setShowSideBySide}
                  />
                  <Label htmlFor="side-by-side" className="text-xs">
                    Side-by-side view
                  </Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8" 
                  onClick={() => onCopy(generateNpmWebAppWithJFrogSnippet(), "Modified workflow copied")}
                >
                  <CopyIcon className="h-3.5 w-3.5 mr-1" />
                  Copy Modified
                </Button>
              </div>
            </div>
            <div className="p-4 bg-black rounded-md overflow-x-auto">
              {diffView}
            </div>
            <div className="mt-4">
              <Label className="text-sm font-medium text-muted-foreground">
                ℹ️ The green highlighted lines show the JFrog configuration added to your workflow.
              </Label>
            </div>
          </div>
          
          <div className="bg-muted rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Original npm workflow:</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8" 
                onClick={() => onCopy(generateNpmWebAppSnippet(), "Original workflow copied")}
              >
                <CopyIcon className="h-3.5 w-3.5 mr-1" />
                Copy Original
              </Button>
            </div>
            <pre className="p-4 bg-black text-white rounded-md overflow-x-auto text-sm">
              {generateNpmWebAppSnippet()}
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

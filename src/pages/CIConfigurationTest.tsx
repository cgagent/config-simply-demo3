
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { 
  ChevronLeft, 
  Github, 
  Circle as CircleIcon, 
  Code, 
  Package, 
  Check, 
  CopyIcon,
  GitBranch
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Repository, commonPackageTypes } from '@/types/repository';

const CIConfigurationTestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const repository = location.state?.repository as Repository;

  const [currentStep, setCurrentStep] = useState(1);
  const [ciServer, setCIServer] = useState<'github' | 'circle' | 'generic' | null>(null);
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<string[]>([]);
  
  // Go back to repositories page
  const handleGoBack = () => {
    navigate('/repositories');
  };

  // Handle CI server selection
  const handleCIServerSelect = (server: 'github' | 'circle' | 'generic') => {
    setCIServer(server);
    setCurrentStep(2);
  };

  // Toggle package type selection
  const togglePackageType = (type: string) => {
    if (selectedPackageTypes.includes(type)) {
      setSelectedPackageTypes(selectedPackageTypes.filter(t => t !== type));
    } else {
      setSelectedPackageTypes([...selectedPackageTypes, type]);
    }
  };

  // Generate setup snippet based on selected package types
  const generateSetupSnippet = () => {
    return `- name: Setup FlyFrog
  uses: jfrog/setup-flyfrog@v1
  with:
    subdomain: acme`;
  };

  // Generate full workflow snippet
  const generateFullSnippet = () => {
    const repoName = repository?.name || 'your-repository';
    const packageTypesStr = selectedPackageTypes.join(', ');

    return `name: CI Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup FlyFrog
        uses: jfrog/setup-flyfrog@v1
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

  // Copy text to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: message,
      });
    });
  };

  // Move to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Conditional button to proceed
  const canProceed = () => {
    if (currentStep === 1) return ciServer !== null;
    if (currentStep === 2) return selectedPackageTypes.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="animate-fadeIn">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={handleGoBack}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to repositories
            </Button>
            <h1 className="text-2xl font-bold">
              Configure CI for {repository?.name || 'Repository'} (Test UX)
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center mb-8 border-b pb-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 1 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  {currentStep > 1 ? <Check className="h-5 w-5" /> : '1'}
                </div>
                <span className="mt-2 text-sm font-medium">Select CI Server</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 2 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  {currentStep > 2 ? <Check className="h-5 w-5" /> : '2'}
                </div>
                <span className="mt-2 text-sm font-medium">Package Managers</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 3 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
                  {currentStep > 3 ? <Check className="h-5 w-5" /> : '3'}
                </div>
                <span className="mt-2 text-sm font-medium">Setup Instructions</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${currentStep >= 4 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: currentStep >= 4 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= 4 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>4</div>
                <span className="mt-2 text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select CI Server */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Step 1: Select CI Server</h2>
              <p className="text-muted-foreground mb-6">
                Choose the continuous integration server where your workflows run
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`flex flex-col items-center border rounded-lg p-6 cursor-pointer hover:bg-muted transition-colors ${ciServer === 'github' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                  onClick={() => handleCIServerSelect('github')}
                >
                  <Github className="h-12 w-12 mb-4" />
                  <h3 className="font-medium">GitHub Actions</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Configure FlyFrog with GitHub Actions workflows
                  </p>
                </div>
                
                <div 
                  className={`flex flex-col items-center border rounded-lg p-6 cursor-pointer hover:bg-muted transition-colors ${ciServer === 'circle' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                  onClick={() => handleCIServerSelect('circle')}
                >
                  <CircleIcon className="h-12 w-12 mb-4" />
                  <h3 className="font-medium">Circle CI</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Configure FlyFrog with Circle CI pipelines
                  </p>
                </div>
                
                <div 
                  className={`flex flex-col items-center border rounded-lg p-6 cursor-pointer hover:bg-muted transition-colors ${ciServer === 'generic' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                  onClick={() => handleCIServerSelect('generic')}
                >
                  <Code className="h-12 w-12 mb-4" />
                  <h3 className="font-medium">Generic CI</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Configure FlyFrog with any other CI system
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={nextStep} 
                  disabled={!canProceed()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Package Managers */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Step 2: Select Package Managers</h2>
              <p className="text-muted-foreground mb-6">
                Choose the package managers that your project uses
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {commonPackageTypes.map((type) => (
                  <div 
                    key={type}
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors ${
                      selectedPackageTypes.includes(type) 
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => togglePackageType(type)}
                  >
                    <div className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      <span className="font-medium capitalize">{type}</span>
                      {selectedPackageTypes.includes(type) && (
                        <Check className="h-4 w-4 ml-auto text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPackageTypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Selected Package Managers:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPackageTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {type}
                        <button 
                          className="ml-1 hover:text-destructive"
                          onClick={() => togglePackageType(type)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Setup Instructions */}
          {currentStep === 3 && (
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
                        onClick={() => copyToClipboard(generateSetupSnippet(), "Setup snippet copied")}
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
                        onClick={() => copyToClipboard(generateFullSnippet(), "Full workflow example copied")}
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
                <Button variant="outline" className="mr-2" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Configuration Complete!</h2>
                <p className="text-muted-foreground text-center max-w-lg mb-6">
                  Your workflow is now configured. Complete the final step to enable FlyFrog in your repository.
                </p>
                
                <div className="w-full max-w-lg bg-muted rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <GitBranch className="h-5 w-5 mr-2" />
                    Step 4: Merge to your default branch
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once merged to your default branch, subsequent commits will have FlyFrog connected with your workflow. 
                    Additionally, you'll find your repo usage dashboard here.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleGoBack}>
                    Back to repositories
                  </Button>
                  <Button variant="default" onClick={() => window.open('https://github.com', '_blank')}>
                    Go to GitHub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CIConfigurationTestPage;

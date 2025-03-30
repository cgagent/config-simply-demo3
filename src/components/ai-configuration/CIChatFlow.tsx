
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Github, Code, Package, Check } from 'lucide-react';
import { ChatOption } from './types';
import { SelectableOptions } from './SelectableOptions';
import SelectCIType from '@/components/set-my-ci/SelectCIType';
import SelectPackageManagers from '@/components/set-my-ci/SelectPackageManagers';
import CISnippetDisplay from '@/components/set-my-ci/snippet-display';
import ImplementationGuide from '@/components/set-my-ci/ImplementationGuide';

interface CIChatFlowProps {
  addBotMessage: (content: React.ReactNode) => void;
  addUserMessage: (content: string) => void;
  onComplete?: () => void;
}

export const CIChatFlow: React.FC<CIChatFlowProps> = ({
  addBotMessage,
  addUserMessage,
  onComplete
}) => {
  const [step, setStep] = useState<'ci-type' | 'packages' | 'snippet' | 'guide' | 'complete'>('ci-type');
  const [selectedCI, setSelectedCI] = useState<'github' | 'other' | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const { toast } = useToast();

  // CI system selection options
  const ciOptions: ChatOption[] = [
    { id: 'github', label: 'GitHub Actions', value: 'github' },
    { id: 'other', label: 'Other CI Systems', value: 'other' }
  ];

  // Package manager options
  const packageOptions: ChatOption[] = [
    { id: 'docker', label: 'Docker', value: 'docker' },
    { id: 'npm', label: 'npm', value: 'npm' },
    { id: 'nuget', label: 'NuGet', value: 'nuget' },
    { id: 'python', label: 'Python', value: 'python' },
    { id: 'maven', label: 'Maven', value: 'maven' },
    { id: 'go', label: 'Go', value: 'go' }
  ];

  // Final options
  const finalOptions: ChatOption[] = [
    { id: 'finish', label: 'Finish Setup', value: 'finish' },
    { id: 'restart', label: 'Start Over', value: 'restart' }
  ];

  // Handle CI type selection
  const handleCISelect = (option: ChatOption) => {
    const ciType = option.value as 'github' | 'other';
    
    // Update state
    setSelectedCI(ciType);
    setStep('packages');
    
    // Add messages to chat
    addUserMessage(`I want to use ${ciType === 'github' ? 'GitHub Actions' : 'Other CI systems'}`);
    
    // Add bot response with package selection
    addBotMessage(
      <>
        <p className="mb-2">Great! You've selected {ciType === 'github' ? 'GitHub Actions' : 'Other CI systems'}.</p>
        <p className="mb-3">Now, please select the package managers used in your project:</p>
        <SelectableOptions 
          options={packageOptions} 
          onSelectOption={handlePackageSelect} 
        />
      </>
    );
  };

  // Handle package manager selection
  const handlePackageSelect = (option: ChatOption) => {
    const packageType = option.value as string;
    
    // Toggle package selection
    let newSelectedPackages: string[];
    if (selectedPackages.includes(packageType)) {
      newSelectedPackages = selectedPackages.filter(p => p !== packageType);
    } else {
      newSelectedPackages = [...selectedPackages, packageType];
    }
    
    setSelectedPackages(newSelectedPackages);
    
    // Add user message
    addUserMessage(`I ${selectedPackages.includes(packageType) ? 'removed' : 'added'} ${packageType}`);
    
    // If this is the first package, add a different message
    if (selectedPackages.length === 0 && !selectedPackages.includes(packageType)) {
      addBotMessage(
        <>
          <p className="mb-2">You've selected {packageType}. You can add more package managers or continue to the next step.</p>
          <p className="mb-3">When you're done selecting packages, click 'Continue':</p>
          <SelectableOptions 
            options={[{ id: 'continue', label: 'Continue to CI setup', value: 'continue' }]} 
            onSelectOption={() => handleContinueToSnippet()}
          />
        </>
      );
    } else if (newSelectedPackages.length === 0) {
      // If they removed the last package
      addBotMessage(
        <>
          <p className="mb-2">You've removed all package managers. Please select at least one package manager to continue:</p>
          <SelectableOptions 
            options={packageOptions} 
            onSelectOption={handlePackageSelect} 
          />
        </>
      );
    } else {
      // Update message for additional packages
      const packageList = newSelectedPackages.join(', ');
      addBotMessage(
        <>
          <p className="mb-2">Your selected package managers: {packageList}.</p>
          <p className="mb-3">You can add more or continue to the next step:</p>
          <SelectableOptions 
            options={[{ id: 'continue', label: 'Continue to CI setup', value: 'continue' }]} 
            onSelectOption={() => handleContinueToSnippet()}
          />
        </>
      );
    }
  };

  // Handle continuing to snippet step
  const handleContinueToSnippet = () => {
    if (selectedPackages.length === 0) {
      toast({
        title: "Please select packages",
        description: "Select at least one package manager to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('snippet');
    addUserMessage('Continue to CI setup');
    
    addBotMessage(
      <>
        <p className="mb-3">Here is the CI configuration snippet for your selected setup:</p>
        <CISnippetDisplay
          selectedCI={selectedCI!}
          selectedPackages={selectedPackages}
          inChatMode={true}
        />
        <div className="mt-3">
          <SelectableOptions 
            options={[{ id: 'guide', label: 'Show implementation guide', value: 'guide' }]} 
            onSelectOption={() => handleContinueToGuide()}
          />
        </div>
      </>
    );
  };

  // Handle continuing to implementation guide
  const handleContinueToGuide = () => {
    setStep('guide');
    addUserMessage('Show implementation guide');
    
    addBotMessage(
      <>
        <p className="mb-3">Here's a quick guide on how to implement this in your CI workflow:</p>
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm my-3">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Implementation Guide</h2>
          <ol className="list-decimal pl-4 text-sm space-y-2 text-gray-700">
            <li>Copy the CI configuration snippet from the previous step</li>
            <li>Navigate to your repository's CI configuration file</li>
            <li>For GitHub Actions, create or edit <code className="bg-gray-100 px-1 rounded">.github/workflows/jfrog.yml</code></li>
            <li>Paste the snippet and commit the changes</li>
            <li>Verify the workflow runs successfully on your next push</li>
          </ol>
        </div>
        <div className="mt-3">
          <SelectableOptions 
            options={finalOptions} 
            onSelectOption={handleFinalOption}
          />
        </div>
      </>
    );
  };

  // Handle final options
  const handleFinalOption = (option: ChatOption) => {
    if (option.value === 'restart') {
      // Reset the flow
      setSelectedCI(null);
      setSelectedPackages([]);
      setStep('ci-type');
      
      addUserMessage('I want to start over');
      
      // Start again with CI type selection
      addBotMessage(
        <>
          <p className="mb-3">Let's start over. First, select your CI system:</p>
          <SelectableOptions 
            options={ciOptions} 
            onSelectOption={handleCISelect} 
          />
        </>
      );
    } else {
      // Finish the flow
      setStep('complete');
      addUserMessage('Finish setup');
      
      addBotMessage(
        <>
          <p className="mb-3">Great! Your CI configuration is ready. You can now implement it in your repository.</p>
          <p>If you have any questions or need further assistance, feel free to ask!</p>
        </>
      );
      
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Start the flow with CI type selection
  const startCIFlow = () => {
    addBotMessage(
      <>
        <p className="mb-3">Let's set up your CI configuration with JFrog. First, select your CI system:</p>
        <SelectableOptions 
          options={ciOptions} 
          onSelectOption={handleCISelect} 
        />
      </>
    );
  };

  return { startCIFlow };
};


import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { CIButtonGroup } from './CIButtonGroup';
import CISnippetDisplay from './snippet-display/CISnippetDisplay';
import { generateFullSnippet } from '../ci-configuration/setup-instructions/snippetGenerators';

const CISetupChat = () => {
  const [messages, setMessages] = useState<Array<{id: number, type: 'system' | 'button-group', content: string | React.ReactNode}>>([
    {
      id: 1,
      type: 'system',
      content: 'Step 1: Select CI System\n\nStreamline your CI pipeline with JFrog\nIntegrating JFrog with your CI system enhances security and improves artifact management.'
    },
    {
      id: 2,
      type: 'button-group',
      content: <CIButtonGroup 
        options={[
          { id: 'github', label: 'GitHub Actions', description: 'Configure JFrog with GitHub Actions' },
          { id: 'other', label: 'Other CI Systems', description: 'Circle CI, Jenkins, GitLab CI' }
        ]}
        onSelect={handleCISelection}
      />
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedCI, setSelectedCI] = useState<string | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Function to handle CI selection
  function handleCISelection(ciType: string) {
    setSelectedCI(ciType);
    setCurrentStep(2);
    
    // Add message acknowledging selection
    const ciName = ciType === 'github' ? 'GitHub Actions' : 'Other CI Systems';
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'system',
        content: `You've selected ${ciName}. Great choice!`
      },
      {
        id: Date.now() + 1,
        type: 'system',
        content: 'Step 2: Select Package Managers\n\nChoose the package managers used in your project.'
      },
      {
        id: Date.now() + 2,
        type: 'button-group',
        content: <CIButtonGroup 
          options={[
            { id: 'docker', label: 'Docker' },
            { id: 'npm', label: 'npm' },
            { id: 'nuget', label: 'NuGet' },
            { id: 'python', label: 'Python' },
            { id: 'maven', label: 'Maven' },
            { id: 'go', label: 'Go' }
          ]}
          onSelect={handlePackageSelection}
          multiSelect
          selectedOptions={selectedPackages}
          showContinueButton={selectedPackages.length > 0}
          onContinue={handleContinueToStep3}
        />
      }
    ]);
  }

  // Function to handle package manager selection
  function handlePackageSelection(packageType: string) {
    if (selectedPackages.includes(packageType)) {
      setSelectedPackages(selectedPackages.filter(p => p !== packageType));
    } else {
      setSelectedPackages([...selectedPackages, packageType]);
    }
  }

  // Function to continue to step 3
  function handleContinueToStep3() {
    setCurrentStep(3);
    
    // Format the selected packages as a comma-separated list
    const packagesText = selectedPackages.join(', ');
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'system',
        content: `You've selected the following package managers: ${packagesText}.`
      },
      {
        id: Date.now() + 1,
        type: 'system',
        content: 'Step 3: Configuration Snippets\n\nBelow are the configuration snippets you can add to your workflow:'
      },
      {
        id: Date.now() + 2,
        type: 'button-group',
        content: <CISnippetDisplay 
          selectedCI={selectedCI as 'github' | 'other'} 
          selectedPackages={selectedPackages}
          onNextStep={() => handleContinueToStep4()}
          onPreviousStep={() => {/* For future implementation */}}
        />
      }
    ]);
  }

  // Function to continue to step 4 (completion)
  function handleContinueToStep4() {
    setCurrentStep(4);
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'system',
        content: 'Step 4: Implementation Guide\n\nFollow these steps to implement the JFrog integration in your CI system:'
      },
      {
        id: Date.now() + 1,
        type: 'button-group',
        content: <CIButtonGroup 
          options={[
            { id: 'finish', label: 'Finish Setup', description: 'Complete the CI setup process' }
          ]}
          onSelect={() => {
            // Add completion message
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                type: 'system',
                content: 'Setup completed successfully! Your CI system is now integrated with JFrog.'
              }
            ]);
          }}
        />
      }
    ]);
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 overflow-y-auto h-[500px]">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              type={message.type}
              content={message.content}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default CISetupChat;

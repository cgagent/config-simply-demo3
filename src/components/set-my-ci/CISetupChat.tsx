
import React, { useRef, useEffect, useState } from 'react';
import { useCISetupState } from './hooks/useCISetupState';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import CompletionStep from './steps/CompletionStep';

const CISetupChat = () => {
  const {
    selectedCI,
    selectedPackages,
    currentStep,
    handleCISelection,
    handlePackageSelection,
    handleContinueToStep3,
    handleContinueToStep4,
    handlePreviousStep,
    getSelectedPackagesText
  } = useCISetupState();
  
  const [messages, setMessages] = useState<Array<{ id: number, component: React.ReactNode }>>([
    { id: 1, component: <StepOne onSelectCI={handleCISelection} selectedCI={selectedCI} /> }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  // Update messages when steps change
  useEffect(() => {
    if (currentStep === 2 && selectedCI) {
      const ciName = selectedCI === 'github' ? 'GitHub Actions' : 'Other CI Systems';
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          component: (
            <StepTwo 
              ciName={ciName} 
              onPackageSelection={handlePackageSelection} 
              selectedPackages={selectedPackages} 
              onContinue={handleContinueToStep3} 
            />
          )
        }
      ]);
    } else if (currentStep === 3) {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          component: (
            <StepThree 
              packagesText={getSelectedPackagesText()} 
              selectedCI={selectedCI} 
              selectedPackages={selectedPackages} 
              onNextStep={handleContinueToStep4}
              onPreviousStep={handlePreviousStep}
            />
          )
        }
      ]);
    } else if (currentStep === 4) {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          component: (
            <StepFour 
              onComplete={() => {
                setSetupComplete(true);
                setMessages(prevMessages => [
                  ...prevMessages,
                  { id: Date.now(), component: <CompletionStep /> }
                ]);
              }} 
            />
          )
        }
      ]);
    }
  }, [currentStep]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 overflow-y-auto h-[500px]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>{message.component}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default CISetupChat;

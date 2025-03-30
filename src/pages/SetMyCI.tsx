
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SelectCIType from '@/components/set-my-ci/SelectCIType';
import SelectPackageManagers from '@/components/set-my-ci/SelectPackageManagers';
import CISnippetDisplay from '@/components/set-my-ci/snippet-display';
import ImplementationGuide from '@/components/set-my-ci/ImplementationGuide';
import { useToast } from '@/hooks/use-toast';

const SetMyCI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCI, setSelectedCI] = useState<'github' | 'other' | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showSection, setShowSection] = useState({
    ciType: true,
    packageManagers: false,
    snippetDisplay: false,
    implementationGuide: false
  });
  
  // Update sections visibility based on selections
  useEffect(() => {
    setShowSection({
      ciType: true,
      packageManagers: !!selectedCI,
      snippetDisplay: !!selectedCI && selectedPackages.length > 0,
      implementationGuide: !!selectedCI && selectedPackages.length > 0
    });
  }, [selectedCI, selectedPackages]);
  
  // Handle going back to previous page
  const handleGoBack = () => {
    navigate('/home');
  };

  // Handle CI selection
  const handleCISelect = (ci: 'github' | 'other') => {
    setSelectedCI(ci);
  };

  // Toggle package manager selection
  const handleTogglePackage = (packageType: string) => {
    if (selectedPackages.includes(packageType)) {
      setSelectedPackages(selectedPackages.filter(p => p !== packageType));
    } else {
      setSelectedPackages([...selectedPackages, packageType]);
    }
    
    // Show toast on selection change
    toast({
      title: selectedPackages.includes(packageType) 
        ? `Removed ${packageType}` 
        : `Added ${packageType}`,
      description: "Configuration updated automatically",
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 mt-8">
        <div className="animate-fadeIn">
          <div className="flex items-center mb-3">
            <Button 
              variant="outline" 
              className="mr-2 text-gray-700 border-gray-300 py-1 px-2 h-7" 
              onClick={handleGoBack}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              Set My CI
            </h1>
          </div>

          <div className="space-y-3">
            {showSection.ciType && (
              <SelectCIType
                selectedCI={selectedCI}
                onSelectCI={handleCISelect}
                canProceed={true}
                onNextStep={() => {}}
              />
            )}

            {showSection.packageManagers && (
              <SelectPackageManagers
                selectedPackages={selectedPackages}
                onTogglePackage={handleTogglePackage}
                canProceed={true}
                onNextStep={() => {}}
                onPreviousStep={() => {}}
              />
            )}

            {showSection.snippetDisplay && (
              <CISnippetDisplay
                selectedCI={selectedCI!}
                selectedPackages={selectedPackages}
                onNextStep={() => {}}
                onPreviousStep={() => {}}
              />
            )}

            {showSection.implementationGuide && (
              <ImplementationGuide
                selectedCI={selectedCI!}
                selectedPackages={selectedPackages}
                onPreviousStep={() => {}}
                onFinish={handleGoBack}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetMyCI;

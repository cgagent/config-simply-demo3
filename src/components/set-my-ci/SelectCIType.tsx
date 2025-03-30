
import React from 'react';
import { Github, Code } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SelectCITypeProps {
  selectedCI: 'github' | 'other' | null;
  onSelectCI: (ci: 'github' | 'other') => void;
  onNextStep: () => void;
  canProceed: boolean;
}

const SelectCIType: React.FC<SelectCITypeProps> = ({
  selectedCI,
  onSelectCI
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Step 1: Select CI System</h2>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-700">Streamline your CI pipeline with JFrog</AlertTitle>
        <AlertDescription className="text-blue-600">
          Integrating JFrog with your CI system enhances security, improves artifact management, 
          and provides better visibility into your build process. Select your CI system below to 
          get started with the integration.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div 
          className={`flex items-center border rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition-colors ${
            selectedCI === 'github' 
              ? 'border-primary bg-blue-100 ring-2 ring-primary/20 shadow-md' 
              : 'border-border'
          }`}
          onClick={() => onSelectCI('github')}
        >
          <Github className="h-12 w-12 mr-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-800">GitHub Actions</h3>
            <p className="text-sm text-blue-600 mt-1">
              Configure JFrog with GitHub Actions workflows
            </p>
          </div>
        </div>
        
        <div 
          className={`flex items-center border rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition-colors ${
            selectedCI === 'other' 
              ? 'border-primary bg-blue-100 ring-2 ring-primary/20 shadow-md' 
              : 'border-border'
          }`}
          onClick={() => onSelectCI('other')}
        >
          <Code className="h-12 w-12 mr-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-800">Other CI Systems</h3>
            <p className="text-sm text-blue-600 mt-1">
              Circle CI, Jenkins, GitLab CI, and others
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCIType;

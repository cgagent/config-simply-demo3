
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { useAuthStage } from './AuthStageProvider';
import { useToast } from '@/hooks/use-toast';

interface ConfirmationStageProps {
  onClose: () => void;
  onComplete?: (hasOrgPermissions: boolean) => void;
}

const ConfirmationStage: React.FC<ConfirmationStageProps> = ({ 
  onClose,
  onComplete
}) => {
  const navigate = useNavigate();
  const { selectedOrg, selectedRepos, handleBack } = useAuthStage();
  const { toast } = useToast();
  
  if (!selectedOrg) return null;
  
  const selectedRepoCount = Object.values(selectedRepos).filter(Boolean).length;
  
  const handleComplete = () => {
    // Complete the GitHub auth flow
    toast({
      title: "Repositories Connected Successfully",
      description: `${selectedRepoCount} repositories from ${selectedOrg.name} have been connected.`,
    });
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(true);
    } else {
      onClose();
      navigate('/repositories');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-primary/10 p-4">
        <p className="font-medium">Ready to connect {selectedRepoCount} repositories:</p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li>From organization: {selectedOrg.name}</li>
          <li>CI/CD will be configured for the selected repositories</li>
          <li>You can add more repositories later</li>
        </ul>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button 
          onClick={handleComplete}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
        >
          Connect Repositories
        </button>
        <button
          onClick={handleBack}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStage;

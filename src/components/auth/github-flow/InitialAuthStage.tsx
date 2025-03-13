
import React from 'react';
import AuthorizationScreen from '../AuthorizationScreen';
import { useAuthStage } from './AuthStageProvider';
import { useToast } from '@/hooks/use-toast';

interface InitialAuthStageProps {
  onClose: () => void;
}

const InitialAuthStage: React.FC<InitialAuthStageProps> = ({ onClose }) => {
  const { setStage } = useAuthStage();
  const { toast } = useToast();
  
  const handleConnectGitHub = () => {
    // Simulate initial GitHub OAuth authentication
    toast({
      title: "GitHub Account Connected",
      description: "Your personal GitHub account has been connected successfully.",
    });
    
    // Move to the next step (requesting org permissions)
    setStage('requestOrgPermissions');
  };
  
  return (
    <AuthorizationScreen 
      onAuthorize={handleConnectGitHub}
      onCancel={onClose}
      isInitialAuth={true}
      title="GitHub Account Connection"
      description="Connect your GitHub account to get started. This will allow you to select and configure your repositories."
    />
  );
};

export default InitialAuthStage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationScreen from '../AuthorizationScreen';
import { useAuthStage } from './AuthStageProvider';
import { useToast } from '@/hooks/use-toast';

interface OrgPermissionsStageProps {
  onClose: () => void;
  onComplete?: (hasOrgPermissions: boolean) => void;
}

const OrgPermissionsStage: React.FC<OrgPermissionsStageProps> = ({ 
  onClose,
  onComplete
}) => {
  const navigate = useNavigate();
  const { setStage, setHasGrantedOrgPermissions } = useAuthStage();
  const { toast } = useToast();
  
  const handleRequestOrgPermissions = () => {
    // Simulate granting org permissions
    setHasGrantedOrgPermissions(true);
    setStage('organization');
  };
  
  const handleSkipOrgPermissions = () => {
    // User chose to connect without granting organization permissions
    toast({
      title: "Organization Access Skipped",
      description: "You can always connect repositories later from the dashboard",
    });
    
    if (onComplete) {
      onComplete(false);
    } else {
      onClose();
      navigate('/repositories');
    }
  };
  
  return (
    <AuthorizationScreen 
      onAuthorize={handleRequestOrgPermissions}
      onSkipOrgPermissions={handleSkipOrgPermissions}
      onCancel={onClose}
      isInitialAuth={false}
    />
  );
};

export default OrgPermissionsStage;

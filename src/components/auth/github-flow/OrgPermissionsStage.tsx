
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
    // Grant org permissions and move to organization selection
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
      onComplete(false); // Indicate that org permissions were not granted
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
      title="GitHub Organization Access"
      description="Grant access to your organizations to select and configure repositories. If you skip this step, you'll need to reconnect later to access organization repositories."
    />
  );
};

export default OrgPermissionsStage;

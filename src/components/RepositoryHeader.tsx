
import React, { useState } from 'react';
import { GitBranch, Github } from 'lucide-react';
import OrganizationSelect from './OrganizationSelect';
import GitHubAuthFlow from './auth/GitHubAuthFlow';
import { Button } from './ui/button';

interface Organization {
  id: string;
  name: string;
}

interface RepositoryHeaderProps {
  organizations: Organization[];
  selectedOrg: Organization;
  setSelectedOrg: (org: Organization) => void;
  onGitHubConnected?: (hasOrgPermissions: boolean) => void;
  onConnectGitHub?: () => void;
}

const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  organizations,
  selectedOrg,
  setSelectedOrg,
  onGitHubConnected,
  onConnectGitHub
}) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
  };

  const handleAuthComplete = (hasOrgPermissions: boolean = false) => {
    setShowAuthDialog(false);
    // Notify parent component that GitHub is connected and whether org permissions were granted
    if (onGitHubConnected) {
      onGitHubConnected(hasOrgPermissions);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold mt-1">Git Repository Manager</h1>
      </div>
      
      {/* Add connect GitHub button */}
      <Button 
        onClick={onConnectGitHub}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Github className="h-4 w-4" />
        Connect GitHub Repo
      </Button>
      
      {/* GitHub Authentication Flow Dialog */}
      <GitHubAuthFlow 
        showDialog={showAuthDialog} 
        onClose={handleCloseAuthDialog}
        onComplete={handleAuthComplete}
      />
    </div>
  );
};

export default RepositoryHeader;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import OrganizationSelector, { GithubOrg } from './OrganizationSelector';
import RepositorySelector, { GithubRepo } from './RepositorySelector';
import AuthorizationScreen from './AuthorizationScreen';
import { githubOrgs, githubRepos } from './githubData';

type GitHubAuthFlowProps = {
  onClose: () => void;
  showDialog: boolean;
  onComplete?: (hasOrgPermissions: boolean) => void;
};

// Auth flow stages that match the GitHub OAuth flow more closely
type AuthStage = 'initial' | 'requestOrgPermissions' | 'organization' | 'repositories' | 'confirmation';

const GitHubAuthFlow: React.FC<GitHubAuthFlowProps> = ({ onClose, showDialog, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stage, setStage] = useState<AuthStage>('initial');
  const [selectedOrg, setSelectedOrg] = useState<GithubOrg | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [hasGrantedOrgPermissions, setHasGrantedOrgPermissions] = useState(false);
  
  // Filter repositories based on selected organization
  const orgRepos = selectedOrg 
    ? githubRepos.filter(repo => repo.orgName === selectedOrg.name)
    : [];
  
  // Step 1: Connect GitHub account (personal)
  const handleConnectGitHub = () => {
    // Simulate initial GitHub OAuth authentication (just the user, no org perms yet)
    toast({
      title: "GitHub Account Connected",
      description: "Your personal GitHub account has been connected.",
    });
    
    // Move to the next step (requesting org permissions)
    setStage('requestOrgPermissions');
  };
  
  // Step 2: Request organization permissions
  const handleRequestOrgPermissions = () => {
    // Simulate granting org permissions
    setHasGrantedOrgPermissions(true);
    setStage('organization');
  };
  
  // Skip org permissions
  const handleSkipOrgPermissions = () => {
    // User chose to connect without granting organization permissions
    toast({
      title: "Organization Access Skipped",
      description: "Connected to GitHub without organization permissions",
    });
    
    if (onComplete) {
      onComplete(false);
    } else {
      onClose();
      navigate('/repositories');
    }
  };
  
  const handleOrgSelect = (org: GithubOrg) => {
    setSelectedOrg(org);
    setStage('repositories');
    
    // Reset repository selection when changing organization
    setSelectedRepos({});
    setSelectAll(false);
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    // Update all repositories' selection status
    const newSelectedRepos: Record<string, boolean> = {};
    orgRepos.forEach(repo => {
      newSelectedRepos[repo.id] = checked;
    });
    setSelectedRepos(newSelectedRepos);
  };
  
  const handleRepoSelect = (repoId: string, checked: boolean) => {
    setSelectedRepos(prev => ({
      ...prev,
      [repoId]: checked
    }));
    
    // Check if all repositories are selected to update selectAll status
    const updatedSelection = {
      ...selectedRepos,
      [repoId]: checked
    };
    
    const allSelected = orgRepos.every(repo => updatedSelection[repo.id]);
    setSelectAll(allSelected);
  };
  
  const handleAuthorize = () => {
    // Move to confirmation after repositories are selected
    setStage('confirmation');
  };
  
  const handleComplete = () => {
    // Complete the GitHub auth flow
    toast({
      title: "GitHub Authentication Successful",
      description: `Connected to ${selectedOrg?.name} with ${Object.values(selectedRepos).filter(Boolean).length} repositories`,
    });
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(true);
    } else {
      onClose();
      navigate('/repositories');
    }
  };
  
  const handleBack = () => {
    if (stage === 'confirmation') {
      setStage('repositories');
    } else if (stage === 'repositories') {
      setStage('organization');
    } else if (stage === 'organization') {
      setStage('requestOrgPermissions');
    } else if (stage === 'requestOrgPermissions') {
      setStage('initial');
    } else {
      onClose();
    }
  };
  
  // Get the appropriate title for the current stage
  const getDialogTitle = () => {
    switch (stage) {
      case 'initial':
        return "Connect to GitHub";
      case 'requestOrgPermissions':
        return "GitHub Organization Access";
      case 'organization':
        return "Select GitHub Organization";
      case 'repositories':
        return "Select Repositories";
      case 'confirmation':
        return "Confirm GitHub Access";
      default:
        return "GitHub Integration";
    }
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {stage === 'initial' && (
            <AuthorizationScreen 
              onAuthorize={handleConnectGitHub}
              onCancel={onClose}
              isInitialAuth={true}
            />
          )}
          
          {stage === 'requestOrgPermissions' && (
            <AuthorizationScreen 
              onAuthorize={handleRequestOrgPermissions}
              onSkipOrgPermissions={handleSkipOrgPermissions}
              onCancel={onClose}
              isInitialAuth={false}
            />
          )}
          
          {stage === 'organization' && (
            <OrganizationSelector 
              githubOrgs={githubOrgs}
              onOrgSelect={handleOrgSelect}
              onBack={handleBack}
            />
          )}
          
          {stage === 'repositories' && selectedOrg && (
            <RepositorySelector
              selectedOrg={selectedOrg}
              repositories={orgRepos}
              selectedRepos={selectedRepos}
              selectAll={selectAll}
              onRepoSelect={handleRepoSelect}
              onSelectAll={handleSelectAll}
              onComplete={handleAuthorize}
              onBack={handleBack}
            />
          )}
          
          {stage === 'confirmation' && selectedOrg && (
            <div className="space-y-4">
              <div className="rounded-md bg-primary/10 p-4">
                <p className="font-medium">This application is requesting access to:</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>Read access to {selectedOrg.name}</li>
                  <li>Access to {Object.values(selectedRepos).filter(Boolean).length} repositories</li>
                  <li>Read and write content in repositories</li>
                  <li>Read organization members</li>
                </ul>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={handleComplete}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  Authorize {selectedOrg.name}
                </button>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubAuthFlow;

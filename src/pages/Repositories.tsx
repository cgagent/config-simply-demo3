import React, { useState } from 'react';
import RepositoryHeader from '@/components/RepositoryHeader';
import RepositoryList from '@/components/RepositoryList';
import StatusSummary from '@/components/StatusSummary';
import { Repository } from '@/types/repository';
import { useToast } from '@/hooks/use-toast';
import GitHubAuthFlow from '@/components/auth/GitHubAuthFlow';

interface Organization {
  id: string;
  name: string;
}

const RepositoriesPage: React.FC = () => {
  const { toast } = useToast();
  // Flag to check if GitHub is connected
  const [isGitHubConnected, setIsGitHubConnected] = useState<boolean>(false);
  // Flag to check if organization permissions were granted
  const [hasOrgPermissions, setHasOrgPermissions] = useState<boolean>(false);
  // State to control the GitHub auth dialog
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(!isGitHubConnected || !hasOrgPermissions);
  
  // Reduced git repositories to just 3 with different configuration statuses
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'infrastructure',
      owner: 'dev-team',
      orgName: 'Development Team',
      language: 'YAML',
      lastUpdated: '12 days ago',
      packageTypes: [],
      isConfigured: false,
      workflows: []
    },
    {
      id: '2',
      name: 'frontend-app',
      owner: 'acme-org',
      orgName: 'ACME Organization',
      language: 'TypeScript',
      lastUpdated: '2 days ago',
      packageTypes: ['npm', 'docker'],
      isConfigured: true,
      packageTypeStatus: {
        'npm': true,
        'docker': true,
        'python': false
      },
      workflows: [
        { 
          id: 'w1', 
          name: 'CI/CD Pipeline', 
          status: 'active', 
          buildNumber: 245,
          lastRun: '2 days ago',
          packageTypes: ['npm']
        },
        { 
          id: 'w2', 
          name: 'Test Suite', 
          status: 'active',
          buildNumber: 244,
          lastRun: '3 days ago',
          packageTypes: ['npm', 'docker']
        }
      ]
    },
    {
      id: '3',
      name: 'backend-api',
      owner: 'acme-org',
      orgName: 'ACME Organization',
      language: 'JavaScript',
      lastUpdated: '5 days ago',
      packageTypes: ['npm', 'python', 'docker'],
      isConfigured: true,
      packageTypeStatus: {
        'npm': true,
        'python': true,
        'docker': true
      },
      workflows: [
        { 
          id: 'w3', 
          name: 'Database Migrations', 
          status: 'active',
          buildNumber: 76,
          lastRun: '5 days ago',
          packageTypes: ['npm', 'python', 'docker']
        }
      ]
    }
  ]);

  // Mock organizations data
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 'org1', name: 'ACME Organization' },
    { id: 'org2', name: 'Development Team' },
    { id: 'org3', name: 'Personal Account' }
  ]);

  const [selectedOrg, setSelectedOrg] = useState<Organization>(organizations[0]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  
  const handleConfigureRepository = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  // Handler for connecting GitHub
  const handleConnectGitHub = () => {
    setShowAuthDialog(true);
  };

  // Handler for GitHub connection with org permissions info
  const handleGitHubConnected = (orgPermissionsGranted: boolean) => {
    setIsGitHubConnected(true);
    setHasOrgPermissions(orgPermissionsGranted);
    setShowAuthDialog(false);
    
    toast({
      title: "GitHub Connected",
      description: orgPermissionsGranted 
        ? "Successfully connected to GitHub with organization access." 
        : "Connected to GitHub without organization access.",
    });
  };

  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
  };

  // Calculate summary statistics
  const totalRepos = repositories.length;
  const configuredRepos = repositories.filter(repo => repo.isConfigured).length;

  return (
    <div className="p-6">
      <div className="animate-fadeIn">
        <RepositoryHeader 
          organizations={organizations}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
          onGitHubConnected={handleGitHubConnected}
          onConnectGitHub={handleConnectGitHub}
        />
        
        {isGitHubConnected && hasOrgPermissions ? (
          <div className="flex flex-col gap-4 mt-4">
            <StatusSummary 
              totalRepos={totalRepos}
              configuredRepos={configuredRepos}
            />
            
            <RepositoryList 
              repositories={repositories}
              onConfigureRepository={handleConfigureRepository}
              organizations={organizations}
              selectedOrg={selectedOrg}
              setSelectedOrg={setSelectedOrg}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[500px]">
            <p className="text-muted-foreground">Please connect to GitHub to view your repositories.</p>
          </div>
        )}
      </div>
      
      {/* GitHub Authentication Flow Dialog */}
      <GitHubAuthFlow 
        showDialog={showAuthDialog} 
        onClose={handleCloseAuthDialog}
        onComplete={handleGitHubConnected}
        skipInitialAuth={isGitHubConnected}
      />
    </div>
  );
};

export default RepositoriesPage;

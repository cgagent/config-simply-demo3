
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import Button from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock GitHub organizations data
const githubOrgs = [
  { id: 'org1', name: 'ACME Organization', isAdmin: true },
  { id: 'org2', name: 'Development Team', isAdmin: true },
  { id: 'org3', name: 'Personal Account', isAdmin: false }
];

// Mock GitHub repositories data, matching what's in the CI page
const githubRepos = [
  {
    id: '1',
    name: 'infrastructure',
    owner: 'dev-team',
    orgName: 'Development Team'
  },
  {
    id: '2',
    name: 'frontend-app',
    owner: 'acme-org',
    orgName: 'ACME Organization'
  },
  {
    id: '3',
    name: 'backend-api',
    owner: 'acme-org',
    orgName: 'ACME Organization'
  }
];

type GitHubAuthFlowProps = {
  onClose: () => void;
  showDialog: boolean;
};

const GitHubAuthFlow: React.FC<GitHubAuthFlowProps> = ({ onClose, showDialog }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stage, setStage] = useState<'auth' | 'organization' | 'repositories'>('auth');
  const [selectedOrg, setSelectedOrg] = useState<typeof githubOrgs[0] | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  
  // Filter repositories based on selected organization
  const orgRepos = selectedOrg 
    ? githubRepos.filter(repo => repo.orgName === selectedOrg.name)
    : [];
  
  const handleOrgSelect = (org: typeof githubOrgs[0]) => {
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
  
  const handleAuth = () => {
    // Simulate GitHub authentication
    setTimeout(() => {
      setStage('organization');
    }, 1000);
  };
  
  const handleComplete = () => {
    // Complete the GitHub auth flow
    toast({
      title: "GitHub Authentication Successful",
      description: `Connected to ${selectedOrg?.name} with ${Object.values(selectedRepos).filter(Boolean).length} repositories`,
    });
    
    onClose();
    navigate('/repositories');
  };
  
  const handleBack = () => {
    if (stage === 'repositories') {
      setStage('organization');
    } else if (stage === 'organization') {
      setStage('auth');
    } else {
      onClose();
    }
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            {stage === 'auth' && "Connect with GitHub"}
            {stage === 'organization' && "Select GitHub Organization"}
            {stage === 'repositories' && "Select Repositories"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {stage === 'auth' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="github-user">GitHub Username or Email</Label>
                <Input id="github-user" placeholder="username@example.com" />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="github-pass">Password</Label>
                <Input id="github-pass" type="password" placeholder="••••••••" />
              </div>
              
              <Button 
                onClick={handleAuth}
                className="w-full justify-center group transition-all duration-300 mt-2"
                icon={<Github className="h-4 w-4" />}
              >
                Authenticate with GitHub
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
          
          {stage === 'organization' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select the organization you want to connect:</p>
              
              <RadioGroup>
                {githubOrgs.map(org => (
                  <div 
                    key={org.id}
                    className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleOrgSelect(org)}
                  >
                    <RadioGroupItem value={org.id} id={`org-${org.id}`} className="mr-2" />
                    <Label htmlFor={`org-${org.id}`} className="flex-1 cursor-pointer">{org.name}</Label>
                    {org.isAdmin ? (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Admin</span>
                    ) : (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Member</span>
                    )}
                  </div>
                ))}
              </RadioGroup>
              
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full justify-center mt-2"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Back
              </Button>
            </div>
          )}
          
          {stage === 'repositories' && selectedOrg && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select repositories from <span className="font-semibold">{selectedOrg.name}</span> to configure:
              </p>
              
              {orgRepos.length > 0 && (
                <div className="pt-2 pb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="font-medium">Select All Repositories</Label>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {orgRepos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No repositories found for this organization</p>
                ) : (
                  orgRepos.map(repo => (
                    <div key={repo.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                      <Checkbox
                        id={`repo-${repo.id}`}
                        checked={selectedRepos[repo.id] || false}
                        onCheckedChange={(checked) => handleRepoSelect(repo.id, !!checked)}
                      />
                      <Label htmlFor={`repo-${repo.id}`} className="flex-1 cursor-pointer">
                        {repo.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={handleComplete}
                  className="w-full justify-center group"
                  icon={<Check className="h-4 w-4" />}
                  disabled={Object.values(selectedRepos).filter(Boolean).length === 0}
                >
                  Complete Setup
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="w-full justify-center"
                  icon={<ChevronLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubAuthFlow;

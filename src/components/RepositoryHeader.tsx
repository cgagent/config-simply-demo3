
import React from 'react';
import { GitBranch } from 'lucide-react';
import Button from '@/components/Button';
import OrganizationSelect from './OrganizationSelect';

interface Organization {
  id: string;
  name: string;
}

interface RepositoryHeaderProps {
  organizations: Organization[];
  selectedOrg: Organization;
  setSelectedOrg: (org: Organization) => void;
}

const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  organizations,
  selectedOrg,
  setSelectedOrg
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dashboard</span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs font-medium">CI</span>
        </div>
        <h1 className="text-3xl font-bold mt-1">Repository Manager</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button icon={<GitBranch className="h-4 w-4" />}>
          Connect Repositories
        </Button>
      </div>
    </div>
  );
};

export default RepositoryHeader;

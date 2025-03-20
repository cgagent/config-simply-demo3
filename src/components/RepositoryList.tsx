
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import RepositoryListHeader from './RepositoryListHeader';
import RepositoryItem from './RepositoryItem';
import { Repository } from '@/types/repository';
import { useNavigate } from 'react-router-dom';

interface Organization {
  id: string;
  name: string;
}

interface RepositoryListProps {
  repositories: Repository[];
  className?: string;
  onConfigureRepository: (repo: Repository) => void;
  organizations?: Organization[];
  selectedOrg?: Organization;
  setSelectedOrg?: (org: Organization) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ 
  repositories,
  className,
  onConfigureRepository,
  organizations,
  selectedOrg,
  setSelectedOrg
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'configured' | 'not-configured'>('all');
  const navigate = useNavigate();
  
  const filteredRepos = repositories
    .filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  repo.owner.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(repo => {
      if (filter === 'all') return true;
      if (filter === 'configured') return repo.isConfigured;
      if (filter === 'not-configured') return !repo.isConfigured;
      return true;
    });
    
  const handleConfigureClick = (repo: Repository) => {
    onConfigureRepository(repo);
    navigate('/ci-configuration', { state: { repository: repo } });
  };

  return (
    <div className={cn("animate-fadeIn", className)}>
      <RepositoryListHeader 
        onSearch={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        organizations={organizations}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
      />
      
      <div className="bg-card dark:bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-secondary dark:bg-secondary font-medium text-sm">
          <div className="col-span-5">Git Repository</div>
          <div className="col-span-2 text-center hidden md:block">Package Types</div>
          <div className="col-span-2 text-center hidden md:block">Last Updated</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center hidden md:block">Configure</div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No git repositories found matching your criteria
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <RepositoryItem 
                key={repo.id}
                repository={repo}
                onClick={() => console.log(repo)}
                onConfigureClick={handleConfigureClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryList;

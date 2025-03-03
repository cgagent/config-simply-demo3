
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import RepositoryListHeader from './RepositoryListHeader';
import RepositoryItem from './RepositoryItem';
import ConfigurationModal from './ConfigurationModal';
import { Repository } from '@/types/repository';
import StatusSummary from './StatusSummary';

interface RepositoryListProps {
  repositories: Repository[];
  className?: string;
  onConfigureRepository: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ 
  repositories,
  className,
  onConfigureRepository
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'configured' | 'not-configured'>('all');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
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
    setSelectedRepo(repo);
    setConfigModalOpen(true);
  };
  
  const configuredCount = repositories.filter(repo => repo.isConfigured).length;

  return (
    <div className={cn("animate-fadeIn", className)}>
      <StatusSummary 
        totalRepos={repositories.length} 
        configuredRepos={configuredCount} 
        className="mb-8"
      />

      <RepositoryListHeader 
        onSearch={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-secondary font-medium text-sm">
          <div className="col-span-6">Repository</div>
          <div className="col-span-2 text-center hidden md:block">Language</div>
          <div className="col-span-2 text-center hidden md:block">Last Updated</div>
          <div className="col-span-2 md:col-span-2 text-center">Status</div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No repositories found matching your criteria
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <RepositoryItem 
                key={repo.id}
                repository={repo}
                onClick={handleConfigureClick}
                onConfigureClick={handleConfigureClick}
              />
            ))
          )}
        </div>
      </div>
      
      <ConfigurationModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        repository={selectedRepo}
      />
    </div>
  );
};

export default RepositoryList;

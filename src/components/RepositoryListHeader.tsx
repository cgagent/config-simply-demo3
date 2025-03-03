
import React from 'react';
import { GitBranch } from 'lucide-react';
import Search from './Search';
import RepositoryFilter from './RepositoryFilter';

interface RepositoryListHeaderProps {
  onSearch: (term: string) => void;
  filter: 'all' | 'configured' | 'not-configured';
  onFilterChange: (filter: 'all' | 'configured' | 'not-configured') => void;
}

const RepositoryListHeader: React.FC<RepositoryListHeaderProps> = ({ 
  onSearch, 
  filter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <GitBranch className="h-5 w-5" />
        <h2>Repositories</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Search 
          onSearch={onSearch} 
          className="w-full sm:w-64"
        />
        
        <RepositoryFilter 
          filter={filter} 
          onFilterChange={onFilterChange} 
        />
      </div>
    </div>
  );
};

export default RepositoryListHeader;

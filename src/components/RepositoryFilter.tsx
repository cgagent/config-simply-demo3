
import React from 'react';
import { Filter } from 'lucide-react';
import Button from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface RepositoryFilterProps {
  filter: 'all' | 'configured' | 'not-configured';
  onFilterChange: (filter: 'all' | 'configured' | 'not-configured') => void;
}

const RepositoryFilter: React.FC<RepositoryFilterProps> = ({ filter, onFilterChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 ml-auto"
          icon={<Filter className="h-4 w-4" />}
        >
          {filter === 'all' && 'All Repositories'}
          {filter === 'configured' && 'Configured'}
          {filter === 'not-configured' && 'Not Configured'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onFilterChange('all')}>
          All Repositories
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('configured')}>
          Configured
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('not-configured')}>
          Not Configured
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepositoryFilter;

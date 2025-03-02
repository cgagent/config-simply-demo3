
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, ChevronRight, Check, AlertTriangle, Settings } from 'lucide-react';
import Button from './Button';
import { Badge } from '@/components/ui/badge';
import { Repository, languageColors } from '@/types/repository';

interface RepositoryItemProps {
  repository: Repository;
  onClick: (repo: Repository) => void;
  onConfigureClick: (repo: Repository) => void;
}

const RepositoryItem: React.FC<RepositoryItemProps> = ({ 
  repository, 
  onClick, 
  onConfigureClick 
}) => {
  return (
    <div 
      className="grid grid-cols-12 gap-2 px-6 py-4 repo-row"
      onClick={() => onClick(repository)}
    >
      <div className="col-span-6 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Github className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="font-medium truncate">{repository.name}</div>
          <div className="text-xs text-muted-foreground truncate">{repository.owner}</div>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center justify-center hidden md:flex">
        <div className="flex items-center">
          <div 
            className={cn(
              "w-3 h-3 rounded-full mr-2", 
              languageColors[repository.language] || languageColors.default
            )}
          ></div>
          <span className="text-sm">{repository.language}</span>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center justify-center text-sm text-muted-foreground hidden md:flex">
        {repository.lastUpdated}
      </div>
      
      <div className="col-span-6 md:col-span-2 flex items-center justify-end md:justify-center gap-3">
        <Badge 
          variant="outline"
          className={cn(
            "flex items-center gap-1",
            repository.isConfigured 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-amber-50 text-amber-700 border-amber-200"
          )}
        >
          {repository.isConfigured ? (
            <>
              <Check className="h-3 w-3" />
              <span>Configured</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3" />
              <span>Not Configured</span>
            </>
          )}
        </Badge>
        
        <Button 
          size="sm"
          variant="ghost"
          className="hidden md:flex rounded-full w-8 h-8 p-0"
          icon={<Settings className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation();
            onConfigureClick(repository);
          }}
        />
        
        <ChevronRight className="h-5 w-5 text-muted-foreground md:hidden" />
      </div>
    </div>
  );
};

export default RepositoryItem;

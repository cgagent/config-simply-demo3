
import React, { useState } from 'react';
import { Repository } from '@/types/repository';
import { ChevronDown, ChevronRight, GitPullRequest, Package } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import Button from './Button';

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
  const [isOpen, setIsOpen] = useState(false);
  const hasWorkflows = repository.workflows && repository.workflows.length > 0;
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-border last:border-b-0"
    >
      <div 
        className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => onClick(repository)}
      >
        <div className="col-span-6 flex items-center gap-2">
          {hasWorkflows && (
            <CollapsibleTrigger 
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-secondary rounded-sm mr-1"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
          )}
          
          {!hasWorkflows && <div className="w-6" />}
          
          <div className="flex flex-col">
            <span className="font-medium truncate">{repository.name}</span>
            <span className="text-xs text-muted-foreground truncate">{repository.orgName}</span>
          </div>
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          {repository.packageTypes && repository.packageTypes.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {repository.packageTypes.map((type, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs bg-secondary text-secondary-foreground"
                >
                  <Package className="h-3 w-3 mr-1" />
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          <span className="text-sm text-muted-foreground">{repository.lastUpdated}</span>
        </div>
        
        <div className="col-span-2 md:col-span-2 flex justify-center items-center">
          {repository.isConfigured ? (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
              Configured
            </span>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onConfigureClick(repository);
              }}
            >
              Configure
            </Button>
          )}
        </div>
      </div>
      
      {hasWorkflows && (
        <CollapsibleContent className="bg-muted/30">
          {repository.workflows?.map((workflow) => (
            <div 
              key={workflow.id}
              className="grid grid-cols-12 gap-2 px-6 py-3 border-t border-border/50 pl-10"
            >
              <div className="col-span-6 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{workflow.name}</span>
                </div>
              </div>
              
              <div className="col-span-2 flex justify-center items-center">
                <span className="text-sm text-muted-foreground">#{workflow.buildNumber || '-'}</span>
              </div>
              
              <div className="col-span-2 flex justify-center items-center">
                <span className="text-sm text-muted-foreground">{workflow.lastRun || '-'}</span>
              </div>
              
              <div className="col-span-2 flex justify-center items-center">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  workflow.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {workflow.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default RepositoryItem;

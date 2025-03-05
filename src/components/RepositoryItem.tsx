
import React, { useState } from 'react';
import { Repository, Workflow } from '@/types/repository';
import { ChevronDown, ChevronRight, GitPullRequest, Package, Check, X, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Calculate package type coverage
  const calculatePackageTypeCoverage = () => {
    if (!repository.packageTypeStatus) return 0;
    
    const total = Object.keys(repository.packageTypeStatus).length;
    if (total === 0) return 0;
    
    const connected = Object.values(repository.packageTypeStatus).filter(Boolean).length;
    return Math.round((connected / total) * 100);
  };

  const coveragePercentage = calculatePackageTypeCoverage();
  const missingPackageTypes = repository.packageTypeStatus 
    ? Object.entries(repository.packageTypeStatus)
        .filter(([_, isConnected]) => !isConnected)
        .map(([type]) => type)
    : [];
  
  const isFullyConfigured = coveragePercentage === 100;

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/ci-configuration', { state: { repository } });
  };

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
          {hasWorkflows && repository.isConfigured && (
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
          
          {(!hasWorkflows || !repository.isConfigured) && <div className="w-6" />}
          
          <div className="flex flex-col">
            <span className="font-medium truncate">{repository.name}</span>
            <span className="text-xs text-muted-foreground truncate">{repository.orgName}</span>
          </div>
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          {repository.isConfigured && repository.packageTypes && repository.packageTypes.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {/* Connected package types */}
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
              
              {/* Missing package types */}
              {missingPackageTypes.map((type, index) => (
                <Badge 
                  key={`missing-${index}`}
                  variant="outline"
                  className="text-xs border-dashed bg-red-50 text-red-500 border-red-200"
                >
                  <X className="h-3 w-3 mr-1" />
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            repository.isConfigured ? 
            <span className="text-xs text-muted-foreground">-</span> :
            <span className="text-xs text-muted-foreground">Not configured yet</span>
          )}
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          {repository.isConfigured ? (
            <span className="text-sm text-muted-foreground">{repository.lastUpdated}</span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
        
        <div className="col-span-2 md:col-span-2 flex justify-center items-center">
          {repository.isConfigured ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    {isFullyConfigured ? (
                      <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs font-medium">Configured</span>
                      </div>
                    ) : (
                      <div className="w-full max-w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{coveragePercentage}%</span>
                        </div>
                        <Progress value={coveragePercentage} className="h-1.5" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleConfigure}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {missingPackageTypes.length > 0 ? (
                    <div className="text-xs">
                      <p>Missing package types:</p>
                      <ul className="list-disc pl-4 mt-1">
                        {missingPackageTypes.map((type) => (
                          <li key={type}>{type}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs">All package types connected</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Configure FlyFrog</span>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={handleConfigure}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {hasWorkflows && repository.isConfigured && (
        <CollapsibleContent className="bg-muted/30">
          {repository.workflows?.map((workflow) => (
            <div 
              key={workflow.id}
              className="grid grid-cols-12 gap-2 px-6 py-3 border-t border-border/50 pl-10"
            >
              <div className="col-span-6 flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{workflow.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-6">
                    / #{workflow.buildNumber || '-'}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2 flex justify-center items-center">
                {workflow.packageTypes && workflow.packageTypes.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {workflow.packageTypes.map((type, index) => (
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

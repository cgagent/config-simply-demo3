import React, { useState } from 'react';
import { Repository } from '@/types/repository';
import { ChevronDown, ChevronRight, Cog } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WorkflowItem from './repository/WorkflowItem';
import PackageTypeBadges from './repository/PackageTypeBadges';
import RepositoryStatus from './repository/RepositoryStatus';

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
  const [repoState, setRepoState] = useState(repository);
  const hasWorkflows = repoState.workflows && repoState.workflows.length > 0;
  const navigate = useNavigate();
  
  const calculatePackageTypeCoverage = () => {
    if (!repoState.packageTypeStatus) return 0;
    
    const total = Object.keys(repoState.packageTypeStatus).length;
    if (total === 0) return 0;
    
    const connected = Object.values(repoState.packageTypeStatus).filter(Boolean).length;
    return Math.round((connected / total) * 100);
  };

  const coveragePercentage = calculatePackageTypeCoverage();
  const missingPackageTypes = repoState.packageTypeStatus 
    ? Object.entries(repoState.packageTypeStatus)
        .filter(([_, isConnected]) => !isConnected)
        .map(([type]) => type)
    : [];
  
  const isFullyConfigured = coveragePercentage === 100;

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/ci-configuration', { state: { repository: repoState } });
  };

  const handleRemoveMissingPackage = (type: string) => {
    if (!repoState.packageTypeStatus) return;
    
    const updatedPackageTypeStatus = { ...repoState.packageTypeStatus };
    delete updatedPackageTypeStatus[type];
    
    const updatedRepo = {
      ...repoState,
      packageTypeStatus: updatedPackageTypeStatus
    };
    
    const newTotal = Object.keys(updatedPackageTypeStatus).length;
    const newConnected = Object.values(updatedPackageTypeStatus).filter(Boolean).length;
    const newCoverage = newTotal > 0 ? Math.round((newConnected / newTotal) * 100) : 100;
    
    setRepoState(updatedRepo);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-border last:border-b-0"
    >
      <div 
        className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => onClick(repoState)}
      >
        <div className="col-span-5 flex items-center gap-2">
          {hasWorkflows && repoState.isConfigured && (
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
          
          {(!hasWorkflows || !repoState.isConfigured) && <div className="w-6" />}
          
          <div className="flex flex-col">
            <span className="font-medium truncate">{repoState.name}</span>
            <span className="text-xs text-muted-foreground truncate">{repoState.orgName}</span>
          </div>
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          {repoState.isConfigured && repoState.packageTypes && repoState.packageTypes.length > 0 ? (
            <PackageTypeBadges 
              packageTypes={repoState.packageTypes}
              missingPackageTypes={missingPackageTypes}
              onRemoveMissingPackage={handleRemoveMissingPackage}
            />
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
        
        <div className="col-span-2 hidden md:flex justify-center items-center">
          {repoState.isConfigured ? (
            <span className="text-sm text-muted-foreground">{repoState.lastUpdated}</span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
        
        <div className="col-span-2 md:col-span-2 flex justify-center items-center">
          <RepositoryStatus
            isConfigured={repoState.isConfigured}
            isFullyConfigured={isFullyConfigured}
            coveragePercentage={coveragePercentage}
            missingPackageTypes={missingPackageTypes}
          />
        </div>

        <div className="col-span-1 md:flex justify-center items-center hidden">
          <Button
            variant="default"
            size="sm"
            onClick={handleConfigure}
          >
            <Cog className="h-4 w-4 mr-2" />
            Set
          </Button>
        </div>
      </div>
      
      {hasWorkflows && repoState.isConfigured && (
        <CollapsibleContent className="bg-muted/30">
          {repoState.workflows?.map((workflow) => (
            <WorkflowItem key={workflow.id} workflow={workflow} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default RepositoryItem;

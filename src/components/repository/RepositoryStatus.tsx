
import React from 'react';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RepositoryStatusProps {
  isConfigured: boolean;
  isFullyConfigured: boolean;
  coveragePercentage: number;
  missingPackageTypes: string[];
}

const RepositoryStatus: React.FC<RepositoryStatusProps> = ({
  isConfigured,
  isFullyConfigured,
  coveragePercentage,
  missingPackageTypes
}) => {
  if (!isConfigured) {
    return (
      <div className="flex justify-center text-xs text-muted-foreground">
        Not configured
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center">
            {isFullyConfigured ? (
              <div className="bg-emerald-950/90 text-emerald-400 dark:bg-emerald-400/20 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center shadow-sm border border-emerald-800/30 dark:border-emerald-400/30">
                <Check className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs font-medium">Configured</span>
              </div>
            ) : (
              <div className="w-24">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-300">{coveragePercentage}%</span>
                </div>
                <Progress 
                  value={coveragePercentage} 
                  className="h-1.5 bg-muted/30 dark:bg-muted/20" 
                  indicatorClassName="bg-amber-500 dark:bg-amber-400"
                />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border border-border text-foreground">
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
  );
};

export default RepositoryStatus;

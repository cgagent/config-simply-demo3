
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
              <div className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                <Check className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs font-medium">Configured</span>
              </div>
            ) : (
              <div className="w-24">
                <div className="flex justify-between text-xs mb-1">
                  <span>{coveragePercentage}%</span>
                </div>
                <Progress value={coveragePercentage} className="h-1.5" />
              </div>
            )}
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
  );
};

export default RepositoryStatus;

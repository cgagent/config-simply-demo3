
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface RepositoryStatusProps {
  isConfigured: boolean;
  isFullyConfigured: boolean;
  coveragePercentage: number;
  missingPackageTypes: string[];
  previousPackageTypeStatus?: Record<string, boolean>;
  showStatusTransition?: boolean;
}

const RepositoryStatus: React.FC<RepositoryStatusProps> = ({
  isConfigured,
  isFullyConfigured,
  coveragePercentage,
  missingPackageTypes,
  previousPackageTypeStatus,
  showStatusTransition
}) => {
  // Calculate previous coverage percentage for animation
  const [animatedPercentage, setAnimatedPercentage] = useState(coveragePercentage);
  const [statusClass, setStatusClass] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  
  // Calculate the previous coverage percentage
  const calculatePreviousCoverage = () => {
    if (!previousPackageTypeStatus) return coveragePercentage;
    
    const total = Object.keys(previousPackageTypeStatus).length;
    if (total === 0) return 0;
    
    const connected = Object.values(previousPackageTypeStatus).filter(Boolean).length;
    return Math.round((connected / total) * 100);
  };
  
  // Calculate if previous status was fully configured
  const wasPreviouslyFullyConfigured = () => {
    if (!previousPackageTypeStatus) return isFullyConfigured;
    
    const total = Object.keys(previousPackageTypeStatus).length;
    if (total === 0) return false;
    
    const connected = Object.values(previousPackageTypeStatus).filter(Boolean).length;
    return connected === total;
  };
  
  // Handle animation when status changes
  useEffect(() => {
    if (showStatusTransition) {
      const previousCoverage = calculatePreviousCoverage();
      const prevFullyConfigured = wasPreviouslyFullyConfigured();
      
      // Always animate when showStatusTransition is true
      console.log("Starting animation from", previousCoverage, "to", coveragePercentage);
      
      // First clearly show the previous state
      setShowPrevious(true);
      setAnimatedPercentage(previousCoverage);
      setStatusClass('');
      setIsAnimating(true);
      
      // Hold the previous state for a moment, then transition smoothly
      setTimeout(() => {
        // Start the transition animation
        setStatusClass('status-transition-start');
        
        // After a short delay, begin changing to the new value
        setTimeout(() => {
          setShowPrevious(false);
          // Smoothly animate to the new value
          setAnimatedPercentage(coveragePercentage);
          setStatusClass('status-transition-end');
          
          // Complete animation
          setTimeout(() => {
            setIsAnimating(false);
            setStatusClass('');
          }, 1500);
        }, 800);
      }, 700); // Show previous state clearly for 700ms
    } else {
      setAnimatedPercentage(coveragePercentage);
      setIsAnimating(false);
      setStatusClass('');
      setShowPrevious(false);
    }
  }, [showStatusTransition, coveragePercentage]);
  
  // Force update when coveragePercentage changes if not animating
  useEffect(() => {
    if (!isAnimating) {
      setAnimatedPercentage(coveragePercentage);
    }
  }, [coveragePercentage]);
  
  if (!isConfigured) {
    return (
      <div className="flex justify-center text-xs text-muted-foreground">
        Not configured
      </div>
    );
  }

  // Determine what to display based on animation state
  const displayPercentage = showPrevious && previousPackageTypeStatus 
    ? calculatePreviousCoverage() 
    : animatedPercentage;
    
  const displayFullyConfigured = showPrevious && previousPackageTypeStatus
    ? wasPreviouslyFullyConfigured()
    : isFullyConfigured;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-center">
          {displayFullyConfigured ? (
            <div className={`bg-emerald-950/90 text-emerald-400 dark:bg-emerald-400/20 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center shadow-sm border border-emerald-800/30 dark:border-emerald-400/30 ${statusClass}`}>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Configured</span>
            </div>
          ) : (
            <div className={`w-24 ${statusClass}`}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-300 transition-all duration-500 ease-in-out">{displayPercentage}%</span>
                {showPrevious && previousPackageTypeStatus && (
                  <span className="text-xs text-amber-500/50 transition-opacity duration-500 ease-in-out">
                    → {coveragePercentage}%
                  </span>
                )}
              </div>
              <Progress 
                value={displayPercentage} 
                className="h-1.5 bg-muted/30 dark:bg-muted/20" 
                indicatorClassName="bg-amber-500 dark:bg-amber-400 transition-all duration-1000 ease-in-out"
              />
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-popover border border-border text-foreground">
        {showPrevious && previousPackageTypeStatus ? (
          <div className="text-xs">
            <p className="font-medium">Updating configuration...</p>
            <div className="flex items-center gap-2 mt-1">
              <span>{calculatePreviousCoverage()}%</span>
              <span className="text-muted-foreground">→</span>
              <span>{coveragePercentage}%</span>
            </div>
          </div>
        ) : missingPackageTypes.length > 0 ? (
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
  );
};

export default RepositoryStatus;

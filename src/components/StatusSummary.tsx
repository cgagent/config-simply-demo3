
import React from 'react';
import { cn } from '@/lib/utils';
import { GitBranch, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StatusSummaryProps {
  totalRepos: number;
  configuredRepos: number;
  className?: string;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ 
  totalRepos, 
  configuredRepos,
  className
}) => {
  const percentage = totalRepos > 0 ? Math.round((configuredRepos / totalRepos) * 100) : 0;
  const unconfiguredRepos = totalRepos - configuredRepos;
  
  return (
    <div className={cn(
      "animate-fadeIn bg-white rounded-lg border border-border p-6 shadow-sm",
      className
    )}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Integration Status</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            GitHub
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Repositories</span>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-semibold">{totalRepos}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Configured</span>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-semibold">{configuredRepos}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Not Configured</span>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-semibold">{unconfiguredRepos}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Configuration progress</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default StatusSummary;

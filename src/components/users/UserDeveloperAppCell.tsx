
import React from 'react';
import { Check, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UserDeveloperAppCellProps {
  developerApp: boolean;
}

const UserDeveloperAppCell: React.FC<UserDeveloperAppCellProps> = ({ developerApp }) => {
  return (
    <div className="flex items-center justify-center">
      {developerApp ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-green-500">
              <Check className="h-5 w-5" />
              <span>Using</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">User is using developer app</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-red-500">
              <X className="h-5 w-5" />
              <span>Not using</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">User is not using developer app</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default UserDeveloperAppCell;


import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UserActionsCellProps {
  user: User;
  onDeleteClick: (user: User) => void;
}

const UserActionsCell: React.FC<UserActionsCellProps> = ({ user, onDeleteClick }) => {
  return (
    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={() => onDeleteClick(user)} 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-100/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Delete user</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default UserActionsCell;

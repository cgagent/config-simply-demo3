
import React from 'react';
import { Shield, Code } from 'lucide-react';
import { User } from '@/types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserRoleCellProps {
  user: User;
  onRoleChange: (userId: string, newRole: 'Admin' | 'Developer') => void;
}

const UserRoleCell: React.FC<UserRoleCellProps> = ({ user, onRoleChange }) => {
  return (
    <Select
      value={user.role}
      onValueChange={(value: 'Admin' | 'Developer') => onRoleChange(user.id, value)}
    >
      <SelectTrigger className="w-[130px]">
        <div className="flex items-center gap-2">
          {user.role === 'Admin' ? (
            <>
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Admin</span>
            </>
          ) : (
            <>
              <Code className="h-4 w-4 text-indigo-400" />
              <span className="font-medium text-indigo-400">Developer</span>
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Admin">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Admin</span>
          </div>
        </SelectItem>
        <SelectItem value="Developer">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-indigo-400" />
            <span>Developer</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserRoleCell;

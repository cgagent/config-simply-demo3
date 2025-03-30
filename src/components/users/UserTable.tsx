
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Calendar, Mail } from 'lucide-react';
import { User } from '@/types/user';
import UserRoleCell from './UserRoleCell';
import UserDeveloperAppCell from './UserDeveloperAppCell';
import UserActionsCell from './UserActionsCell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onRoleChange: (userId: string, newRole: 'Admin' | 'Developer') => void;
  onDeleteClick: (user: User) => void;
  formatDate: (dateString: string) => string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEditUser, 
  onRoleChange, 
  onDeleteClick,
  formatDate
}) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-muted/60">
            <TableHead className="text-foreground font-semibold">Name</TableHead>
            <TableHead className="text-foreground font-semibold">Email</TableHead>
            <TableHead className="text-foreground font-semibold">Role</TableHead>
            <TableHead className="text-foreground font-semibold">Last Login</TableHead>
            <TableHead className="text-foreground font-semibold">Developer App</TableHead>
            <TableHead className="text-foreground font-semibold w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              className={`border-border hover:bg-muted/30 group ${user.status === 'pending' ? 'bg-blue-950/20 opacity-75' : ''}`}
            >
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-3">
                  {user.status === 'pending' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-blue-500/80" variant="secondary">Pending</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">User hasn't completed registration</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={`https://i.pravatar.cc/150?u=${user.email}`} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <AvatarFallback>
                        {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span>
                    {user.status === 'pending' ? 
                      '' : 
                      `${user.firstName} ${user.lastName}`
                    }
                  </span>
                </div>
              </TableCell>
              <TableCell className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </TableCell>
              <TableCell>
                <UserRoleCell user={user} onRoleChange={onRoleChange} />
              </TableCell>
              <TableCell className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {user.status === 'pending' ? 
                  'Not logged in yet' : 
                  formatDate(user.lastLoginDate)
                }
              </TableCell>
              <TableCell>
                {user.status === 'pending' ? (
                  <div className="flex items-center justify-center">
                    <span className="text-muted-foreground text-sm italic">N/A</span>
                  </div>
                ) : (
                  <UserDeveloperAppCell developerApp={user.developerApp} />
                )}
              </TableCell>
              <TableCell>
                <UserActionsCell user={user} onDeleteClick={onDeleteClick} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;

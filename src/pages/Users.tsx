import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import UserTable from '@/components/users/UserTable';
import UserFormWrapper from '@/components/users/UserFormWrapper';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      lastLoginDate: '2023-10-15T14:30:00Z',
      developerApp: true,
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'Developer',
      lastLoginDate: '2023-10-14T09:15:00Z',
      developerApp: false,
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      role: 'Developer',
      lastLoginDate: '2023-10-13T16:45:00Z',
      developerApp: true,
      status: 'active'
    },
    {
      id: '4',
      firstName: '',
      lastName: '',
      email: 'pending.user@example.com',
      role: 'Developer',
      lastLoginDate: '2023-10-13T16:45:00Z',
      developerApp: false,
      status: 'pending'
    },
    {
      id: '7',
      firstName: '',
      lastName: '',
      email: 'pending.user4@example.com',
      role: 'Developer',
      lastLoginDate: '',
      developerApp: false,
      status: 'pending'
    },
    {
      id: '8',
      firstName: '',
      lastName: '',
      email: 'pending.user5@example.com',
      role: 'Admin',
      lastLoginDate: '',
      developerApp: false,
      status: 'pending'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (userData: User) => {
    if (editingUser) {
      setUsers(users.map(user => user.id === userData.id ? userData : user));
      toast({
        title: "User updated",
        description: userData.status === 'pending' 
          ? `Pending user (${userData.email}) has been updated.`
          : `${userData.firstName} ${userData.lastName}'s information has been updated.`
      });
    } else {
      const newUser: User = {
        ...userData,
        id: String(Date.now()),
        lastLoginDate: new Date().toISOString(),
        developerApp: false,
        status: 'pending' as const // Use const assertion to fix type error
      };
      setUsers([...users, newUser]);
      toast({
        title: "User invited",
        description: `An invitation has been sent to ${newUser.email}.`
      });
    }
    setIsFormOpen(false);
  };

  const handleRoleChange = (userId: string, newRole: 'Admin' | 'Developer') => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    }));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Role updated",
        description: user.status === 'pending'
          ? `Pending user (${user.email})'s role has been updated to ${newRole}.`
          : `${user.firstName} ${user.lastName}'s role has been updated to ${newRole}.`
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast({
        title: "User deleted",
        description: userToDelete.status === 'pending'
          ? `Pending user (${userToDelete.email}) has been removed.`
          : `${userToDelete.firstName} ${userToDelete.lastName} has been removed from JFrog.`,
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="animate-fadeIn max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <Button onClick={handleAddUser} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
        
        <UserTable 
          users={users}
          onEditUser={handleEditUser}
          onRoleChange={handleRoleChange}
          onDeleteClick={handleDeleteClick}
          formatDate={formatDate}
        />
      </div>

      <UserFormWrapper
        isOpen={isFormOpen}
        editingUser={editingUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userToDelete={userToDelete}
        onConfirmDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UsersPage;

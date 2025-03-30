
import React from 'react';
import { User } from '@/types/user';
import UserForm from '@/components/UserForm';

interface UserFormWrapperProps {
  isOpen: boolean;
  editingUser: User | null;
  onClose: () => void;
  onSubmit: (userData: User) => void;
}

const UserFormWrapper: React.FC<UserFormWrapperProps> = ({ 
  isOpen, 
  editingUser, 
  onClose, 
  onSubmit 
}) => {
  return (
    isOpen && (
      <UserForm 
        user={editingUser} 
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )
  );
};

export default UserFormWrapper;

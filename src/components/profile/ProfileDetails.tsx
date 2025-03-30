
import React from 'react';
import { Mail, Calendar, UserCircle, User, Check, X } from 'lucide-react';
import ProfileInfoItem from './ProfileInfoItem';

interface ProfileDetailsProps {
  email: string;
  role: string;
  lastLoginDate: string;
  developerApp: boolean;
  formatDate: (dateString: string) => string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  email,
  role,
  lastLoginDate,
  developerApp,
  formatDate
}) => {
  return (
    <div className="space-y-4">
      <ProfileInfoItem
        icon={<Mail className="h-5 w-5 text-blue-300" />}
        label="Email Address"
        value={email}
      />
      
      <ProfileInfoItem
        icon={<UserCircle className="h-5 w-5 text-blue-300" />}
        label="Role"
        value={role}
      />
      
      <ProfileInfoItem
        icon={<Calendar className="h-5 w-5 text-blue-300" />}
        label="Last Login"
        value={formatDate(lastLoginDate)}
      />
      
      <ProfileInfoItem
        icon={<User className="h-5 w-5 text-blue-300" />}
        label="Developer App"
        value={
          developerApp ? 
            <Check className="h-5 w-5 text-green-500" /> : 
            <X className="h-5 w-5 text-red-500" />
        }
      />
    </div>
  );
};

export default ProfileDetails;

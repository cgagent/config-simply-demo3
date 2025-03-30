
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Developer';
  lastLoginDate: string;
  developerApp: boolean;
}

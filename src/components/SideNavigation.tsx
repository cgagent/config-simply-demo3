
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GitBranch, 
  Package, 
  Users
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'CI', path: '/repositories', icon: <GitBranch className="w-5 h-5" /> },
  { name: 'Packages', path: '/packages', icon: <Package className="w-5 h-5" /> },
  { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" /> },
];

interface SideNavigationProps {
  className?: string;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ className }) => {
  const location = useLocation();
  
  return (
    <nav className={cn("py-4", className)}>
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideNavigation;

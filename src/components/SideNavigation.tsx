
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
  
  // CI Configuration page is part of the repositories section
  const isActive = (path: string) => {
    if (path === '/repositories' && location.pathname === '/ci-configuration') {
      return true;
    }
    return location.pathname === path;
  };
  
  return (
    <nav className={cn("py-2", className)}>
      <ul className={cn("space-y-1", className?.includes("flex-row") && "flex space-x-2 space-y-0")}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                  active 
                    ? "bg-primary text-white" 
                    : "text-foreground hover:text-foreground"
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

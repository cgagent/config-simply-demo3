
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  GitMerge, 
  Users,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
  { name: 'CI', path: '/repositories', icon: <GitMerge className="w-5 h-5" /> },
  { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" /> },
];

interface SideNavigationProps {
  className?: string;
  onHomeLinkClick?: () => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ className, onHomeLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // CI Configuration page is part of the repositories section
  const isActive = (path: string) => {
    if (path === '/repositories' && location.pathname === '/ci-configuration') {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    if (path === '/home') {
      // Always trigger the callback for home, regardless of current location
      if (onHomeLinkClick) {
        onHomeLinkClick();
      }
      
      // If we're already on the home page, we need to use state to trigger a reset
      if (location.pathname === '/home') {
        navigate('/home', { state: { resetChat: true }, replace: true });
      } else {
        navigate('/home');
      }
    } else {
      navigate(path);
    }
  };
  
  return (
    <nav className={cn("py-2 bg-gradient-to-r from-ocean-900 to-ocean-800", className)}>
      <ul className="flex items-center space-x-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <li key={item.path}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  active 
                    ? "bg-ocean-500 text-white shadow-sm" 
                    : "text-ocean-100 hover:bg-ocean-700 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.icon}
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideNavigation;

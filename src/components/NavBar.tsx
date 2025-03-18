
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  UserCircle, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight,
  Home,
  GitBranch,
  Users
} from 'lucide-react';

interface NavBarProps {
  className?: string;
  onHomeLinkClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ className, onHomeLinkClick }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
    { name: 'CI', path: '/repositories', icon: <GitBranch className="w-5 h-5" /> },
    { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" /> },
  ];

  const handleNavClick = (path: string) => {
    if (path === '/home') {
      // If we're already on home, we need to force a reset
      if (location.pathname === '/home') {
        navigate('/home', { state: { resetChat: true }, replace: true });
      } else {
        navigate('/home');
      }
      
      // Always call the callback if provided
      if (onHomeLinkClick) {
        onHomeLinkClick();
      }
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-50 flex flex-col py-4 border-r border-green-900/30 shadow-sm transition-all duration-300",
      "bg-gradient-to-b from-black via-black to-black",
      expanded ? "w-56" : "w-16",
      className
    )}>
      <div className="flex items-center justify-between px-4 mb-6">
        {expanded && <span className="text-lg font-semibold text-white">Dashboard</span>}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="p-1.5 rounded-full bg-green-800/20 hover:bg-green-800/40 text-white transition-colors"
        >
          {expanded ? 
            <ChevronLeft className="h-5 w-5" /> : 
            <ChevronRight className="h-5 w-5" />
          }
        </button>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path || 
              (item.path === '/repositories' && location.pathname === '/ci-configuration');
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                    active 
                      ? "bg-green-600/50 text-white" 
                      : "text-green-100/80 hover:bg-green-800/30 hover:text-white"
                  )}
                >
                  <span>{item.icon}</span>
                  {expanded && <span>{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none w-full">
            <Avatar className="h-8 w-8 border-2 border-green-600/30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="text-left">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-green-200/80">Admin</p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite Friends</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>Download Desktop App</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavBar;

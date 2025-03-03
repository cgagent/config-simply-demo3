
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { UserCircle, Settings, HelpCircle, BellRing } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import SideNavigation from './SideNavigation';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full h-16 px-6 border-b border-border glass-effect z-50 sticky top-0",
      className
    )}>
      <nav className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-white font-semibold">
              R
            </div>
            <span className="font-semibold text-lg">Repository Manager</span>
          </Link>
          
          <div className="hidden md:block ml-8">
            <SideNavigation className="flex-row space-y-0 space-x-1" />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                  <BellRing className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help & Documentation</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="h-6 w-px bg-border"></div>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;

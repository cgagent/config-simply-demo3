
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import SideNavigation from './SideNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, UserCircle, UserPlus } from 'lucide-react';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full px-6 border-b border-border glass-effect z-50 sticky top-0",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-white font-semibold">
                R
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                </div>
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
        
        <div className="flex justify-center -mb-px">
          <SideNavigation className="flex-row space-y-0" />
        </div>
      </div>
    </header>
  );
};

export default NavBar;

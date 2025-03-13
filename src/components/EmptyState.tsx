
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Github, PlusCircle, ArrowRight, Building2 } from 'lucide-react';

interface EmptyStateProps {
  className?: string;
  onConnect: () => void;
  noOrgAccess?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className, onConnect, noOrgAccess = false }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 rounded-lg border border-dashed border-border bg-accent/50 animate-fadeIn min-h-[500px] mx-auto max-w-3xl",
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
        {noOrgAccess ? (
          <Building2 className="h-10 w-10 text-primary" />
        ) : (
          <Github className="h-10 w-10 text-primary" />
        )}
      </div>
      
      {noOrgAccess ? (
        <>
          <h2 className="text-2xl font-bold mb-3">Organization Access Required</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You've connected your GitHub account, but you need to grant organization access to configure repositories.
          </p>
          <Button 
            onClick={onConnect}
            icon={<Building2 className="h-4 w-4" />}
            className="button-shine group transition-all duration-300"
            size="lg"
          >
            Connect GitHub Repo
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3">Connect GitHub Repositories</h2>
          <p className="text-muted-foreground mb-3 max-w-md">
            Connect your GitHub repositories to configure them with our CI/CD pipeline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 w-full max-w-2xl">
            <div className="flex flex-col items-center p-4 rounded-lg bg-background border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-1">Grant Access</h3>
              <p className="text-xs text-muted-foreground">Allow access to your organizations</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-1">Select</h3>
              <p className="text-xs text-muted-foreground">Choose repositories to configure</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-1">Configure</h3>
              <p className="text-xs text-muted-foreground">Set up CI/CD workflows</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              onClick={onConnect}
              icon={<Github className="h-4 w-4" />}
              className="button-shine group transition-all duration-300"
              size="lg"
            >
              Connect GitHub Repo
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmptyState;

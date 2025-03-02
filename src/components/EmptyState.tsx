
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Github, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  className?: string;
  onConnect: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className, onConnect }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-border bg-accent/50 animate-fadeIn",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <Github className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Connect to GitHub</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Connect your GitHub account to view and manage repositories. You'll be able to configure integration settings for each repository.
      </p>
      <Button 
        onClick={onConnect}
        icon={<PlusCircle className="h-4 w-4" />}
        className="button-shine"
      >
        Connect GitHub Organization
      </Button>
    </div>
  );
};

export default EmptyState;

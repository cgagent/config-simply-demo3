
import React from 'react';
import { Github } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AuthStageProvider } from './github-flow/AuthStageProvider';
import StageRenderer from './github-flow/StageRenderer';

type GitHubAuthFlowProps = {
  onClose: () => void;
  showDialog: boolean;
  onComplete?: (hasOrgPermissions: boolean) => void;
  skipInitialAuth?: boolean;
};

const GitHubAuthFlow: React.FC<GitHubAuthFlowProps> = ({ 
  onClose, 
  showDialog, 
  onComplete,
  skipInitialAuth = false
}) => {
  // Get the appropriate title for the current stage
  const getDialogTitle = () => {
    return skipInitialAuth ? "Connect GitHub Repositories" : "GitHub Integration";
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {skipInitialAuth 
              ? "Grant organization access to select and configure repositories" 
              : "Connect to GitHub and configure your repositories"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <AuthStageProvider onClose={onClose}>
            <StageRenderer 
              onClose={onClose} 
              onComplete={onComplete} 
              skipInitialAuth={skipInitialAuth}
            />
          </AuthStageProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubAuthFlow;

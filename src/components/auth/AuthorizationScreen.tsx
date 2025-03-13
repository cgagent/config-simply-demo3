
import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import Button from '@/components/Button';

interface AuthorizationScreenProps {
  onAuthorize: () => void;
  onSkipOrgPermissions?: () => void;
  onCancel: () => void;
  isInitialAuth?: boolean;
}

const AuthorizationScreen: React.FC<AuthorizationScreenProps> = ({ 
  onAuthorize, 
  onSkipOrgPermissions,
  onCancel,
  isInitialAuth = true
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          {isInitialAuth 
            ? "Connect your GitHub account to import and configure your repositories. You'll be redirected to GitHub to authorize access."
            : "Grant access to your organizations to select and configure repositories. This step is required to use the CI/CD features."}
        </p>
      </div>
      
      <div className="rounded-md border p-4">
        <div className="mb-2 flex items-center gap-2">
          <Github className="h-5 w-5" />
          <h3 className="font-medium">
            {isInitialAuth ? "GitHub Account Connection" : "Repository Access"}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          This app will request permission to:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {isInitialAuth ? (
            <>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Read your basic profile information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verify your GitHub identity</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access your repositories and organizations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Configure CI/CD workflows for selected repositories</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Set up automated builds and deployments</span>
              </li>
            </>
          )}
        </ul>
      </div>
      
      <div className="flex flex-col space-y-2 pt-4">
        <Button
          onClick={onAuthorize}
          className="w-full justify-center"
          icon={<Github className="h-4 w-4" />}
        >
          {isInitialAuth ? "Connect GitHub Account" : "Connect GitHub Repositories"}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
        
        {!isInitialAuth && onSkipOrgPermissions && (
          <Button
            onClick={onSkipOrgPermissions}
            variant="outline"
            className="w-full justify-center"
          >
            Skip for now
          </Button>
        )}
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full justify-center"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AuthorizationScreen;

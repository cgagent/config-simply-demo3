
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Github, Info, Shield, Webhook, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Button from './Button';
import { Separator } from '@/components/ui/separator';

interface ConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repository: Repository | null;
}

interface Repository {
  id: string;
  name: string;
  owner: string;
  isConfigured: boolean;
  language: string;
  lastUpdated: string;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ 
  open, 
  onOpenChange,
  repository
}) => {
  const [saving, setSaving] = useState(false);
  const [webhooks, setWebhooks] = useState(repository?.isConfigured || false);
  const [cicd, setCicd] = useState(repository?.isConfigured || false);
  const [security, setSecurity] = useState(repository?.isConfigured || false);
  
  if (!repository) return null;
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] animate-fadeIn">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Configure Repository
          </DialogTitle>
          <DialogDescription>
            {repository.owner}/{repository.name}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Webhook className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="text-sm font-medium">Webhook Integration</h4>
                  <p className="text-xs text-muted-foreground">
                    Enable webhook events from this repository
                  </p>
                </div>
              </div>
              <Switch 
                checked={webhooks} 
                onCheckedChange={setWebhooks} 
                id="webhook-switch"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="text-sm font-medium">CI/CD Pipeline</h4>
                  <p className="text-xs text-muted-foreground">
                    Set up continuous integration and deployment
                  </p>
                </div>
              </div>
              <Switch 
                checked={cicd} 
                onCheckedChange={setCicd} 
                id="cicd-switch"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="text-sm font-medium">Security Scanning</h4>
                  <p className="text-xs text-muted-foreground">
                    Enable automated security vulnerability scanning
                  </p>
                </div>
              </div>
              <Switch 
                checked={security} 
                onCheckedChange={setSecurity} 
                id="security-switch"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-4 px-2 py-3 bg-primary/5 rounded-md text-sm">
              <Info className="h-4 w-4 text-primary" />
              <span>
                These settings will be applied immediately after saving.
              </span>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-pattern">Branch Pattern</Label>
                <input
                  id="branch-pattern"
                  className="w-full h-10 px-3 py-2 border border-input rounded-md"
                  placeholder="main, develop, feature/*"
                  defaultValue="*"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commit-events">Commit Events</Label>
                <select
                  id="commit-events"
                  className="w-full h-10 px-3 py-2 border border-input rounded-md"
                  defaultValue="all"
                >
                  <option value="all">All events</option>
                  <option value="push">Push only</option>
                  <option value="pr">Pull requests only</option>
                </select>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Advanced Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="skip-ci" />
                    <Label htmlFor="skip-ci">Skip CI for documentation changes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-merge" />
                    <Label htmlFor="auto-merge">Enable auto-merge for dependency updates</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            icon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            loading={saving}
            icon={!saving && <CheckCircle2 className="h-4 w-4" />}
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;

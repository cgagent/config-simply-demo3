
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import StatusSummary from '@/components/StatusSummary';
import RepositoryList, { Repository } from '@/components/RepositoryList';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { Github, Filter, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for repositories
const mockRepos: Repository[] = [
  {
    id: '1',
    name: 'frontend-app',
    owner: 'acme-org',
    isConfigured: true,
    language: 'TypeScript',
    lastUpdated: '2 days ago'
  },
  {
    id: '2',
    name: 'backend-api',
    owner: 'acme-org',
    isConfigured: true,
    language: 'JavaScript',
    lastUpdated: '5 days ago'
  },
  {
    id: '3',
    name: 'documentation',
    owner: 'acme-org',
    isConfigured: false,
    language: 'TypeScript',
    lastUpdated: '1 week ago'
  },
  {
    id: '4',
    name: 'analytics-dashboard',
    owner: 'acme-org',
    isConfigured: false,
    language: 'JavaScript',
    lastUpdated: '3 days ago'
  },
  {
    id: '5',
    name: 'design-system',
    owner: 'acme-org',
    isConfigured: true,
    language: 'TypeScript',
    lastUpdated: '2 weeks ago'
  },
  {
    id: '6',
    name: 'mobile-app',
    owner: 'acme-org',
    isConfigured: false,
    language: 'Dart',
    lastUpdated: '1 day ago'
  },
  {
    id: '7',
    name: 'infrastructure',
    owner: 'acme-org',
    isConfigured: true,
    language: 'Go',
    lastUpdated: '2 days ago'
  }
];

const Index = () => {
  const [connected, setConnected] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>(mockRepos);
  const [loading, setLoading] = useState(false);
  
  const configuredCount = repositories.filter(repo => repo.isConfigured).length;
  
  const handleConnect = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
    }, 1500);
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleConfigureRepository = (repo: Repository) => {
    // This would open the configuration modal, but we're handling that in the RepositoryList component
    console.log(`Configuring repository: ${repo.name}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dashboard</span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-medium">GitHub Integration</span>
              </div>
              <h1 className="text-3xl font-bold mt-1">Repository Integration</h1>
            </div>
            
            {connected && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  loading={loading}
                  icon={!loading && <RefreshCw className="h-4 w-4" />}
                >
                  Refresh
                </Button>
                
                <Button 
                  icon={<Github className="h-4 w-4" />}
                >
                  Connect New Repository
                </Button>
              </div>
            )}
          </div>
          
          {connected && (
            <StatusSummary 
              totalRepos={repositories.length} 
              configuredRepos={configuredCount} 
            />
          )}
        </div>
        
        {!connected ? (
          <EmptyState onConnect={handleConnect} />
        ) : (
          <RepositoryList 
            repositories={repositories}
            onConfigureRepository={handleConfigureRepository}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

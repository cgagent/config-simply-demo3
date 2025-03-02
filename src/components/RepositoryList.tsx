
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Github, ChevronRight, Check, AlertTriangle, Settings, Filter } from 'lucide-react';
import Button from './Button';
import Search from './Search';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ConfigurationModal from './ConfigurationModal';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  isConfigured: boolean;
  language: string;
  lastUpdated: string;
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  'C#': 'bg-purple-500',
  PHP: 'bg-indigo-500',
  Ruby: 'bg-red-600',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-500',
  Swift: 'bg-orange-600',
  Kotlin: 'bg-purple-600',
  Dart: 'bg-blue-400',
  default: 'bg-gray-500'
};

interface RepositoryListProps {
  repositories: Repository[];
  className?: string;
  onConfigureRepository: (repo: Repository) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ 
  repositories,
  className,
  onConfigureRepository
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'configured' | 'not-configured'>('all');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  const filteredRepos = repositories
    .filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  repo.owner.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(repo => {
      if (filter === 'all') return true;
      if (filter === 'configured') return repo.isConfigured;
      if (filter === 'not-configured') return !repo.isConfigured;
      return true;
    });
    
  const handleConfigureClick = (repo: Repository) => {
    setSelectedRepo(repo);
    setConfigModalOpen(true);
  };
  
  return (
    <div className={cn("animate-fadeIn", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Github className="h-5 w-5" />
          <h2>GitHub Repositories</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Search 
            onSearch={setSearchTerm} 
            className="w-full sm:w-64"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 ml-auto"
                icon={<Filter className="h-4 w-4" />}
              >
                {filter === 'all' && 'All Repositories'}
                {filter === 'configured' && 'Configured'}
                {filter === 'not-configured' && 'Not Configured'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Repositories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('configured')}>
                Configured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('not-configured')}>
                Not Configured
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-secondary font-medium text-sm">
          <div className="col-span-6">Repository</div>
          <div className="col-span-2 text-center hidden md:block">Language</div>
          <div className="col-span-2 text-center hidden md:block">Last Updated</div>
          <div className="col-span-2 md:col-span-2 text-center">Status</div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No repositories found matching your criteria
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div 
                key={repo.id} 
                className="grid grid-cols-12 gap-2 px-6 py-4 repo-row"
                onClick={() => handleConfigureClick(repo)}
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <Github className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{repo.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{repo.owner}</div>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center justify-center hidden md:flex">
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-full mr-2", 
                        languageColors[repo.language] || languageColors.default
                      )}
                    ></div>
                    <span className="text-sm">{repo.language}</span>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center justify-center text-sm text-muted-foreground hidden md:flex">
                  {repo.lastUpdated}
                </div>
                
                <div className="col-span-6 md:col-span-2 flex items-center justify-end md:justify-center gap-3">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1",
                      repo.isConfigured 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {repo.isConfigured ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Configured</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        <span>Not Configured</span>
                      </>
                    )}
                  </Badge>
                  
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="hidden md:flex rounded-full w-8 h-8 p-0"
                    icon={<Settings className="h-4 w-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfigureClick(repo);
                    }}
                  />
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground md:hidden" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <ConfigurationModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        repository={selectedRepo}
      />
    </div>
  );
};

export default RepositoryList;

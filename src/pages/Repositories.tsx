
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import RepositoryHeader from '@/components/RepositoryHeader';
import RepositoryList from '@/components/RepositoryList';
import { Repository } from '@/types/repository';
import OrganizationSelect from '@/components/OrganizationSelect';

interface Organization {
  id: string;
  name: string;
}

const RepositoriesPage: React.FC = () => {
  // Mock repositories data with workflows as children
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'frontend-app',
      owner: 'acme-org',
      orgName: 'ACME Organization',
      language: 'TypeScript',
      lastUpdated: '2 days ago',
      packageTypes: ['npm', 'docker'],
      isConfigured: true,
      packageTypeStatus: {
        'npm': true,
        'docker': true,
        'python': false
      },
      workflows: [
        { 
          id: 'w1', 
          name: 'CI/CD Pipeline', 
          status: 'active', 
          buildNumber: 245,
          lastRun: '2 days ago',
          packageTypes: ['npm']
        },
        { 
          id: 'w2', 
          name: 'Test Suite', 
          status: 'active',
          buildNumber: 244,
          lastRun: '3 days ago',
          packageTypes: ['npm', 'docker']
        }
      ]
    },
    {
      id: '2',
      name: 'backend-api',
      owner: 'acme-org',
      orgName: 'ACME Organization',
      language: 'JavaScript',
      lastUpdated: '5 days ago',
      packageTypes: ['npm', 'python'],
      isConfigured: true,
      packageTypeStatus: {
        'npm': true,
        'python': true,
        'docker': false
      },
      workflows: [
        { 
          id: 'w3', 
          name: 'Database Migrations', 
          status: 'inactive',
          buildNumber: 76,
          lastRun: '5 days ago',
          packageTypes: ['npm', 'python']
        }
      ]
    },
    {
      id: '3',
      name: 'documentation',
      owner: 'dev-team',
      orgName: 'Development Team',
      language: 'Markdown',
      lastUpdated: '10 days ago',
      packageTypes: ['maven', 'rpm'],
      isConfigured: true,
      packageTypeStatus: {
        'maven': true,
        'rpm': true,
        'debian': false
      },
      workflows: [
        { 
          id: 'w4', 
          name: 'Documentation Build', 
          status: 'active',
          buildNumber: 35,
          lastRun: '10 days ago',
          packageTypes: ['maven', 'rpm']
        }
      ]
    },
    {
      id: '4',
      name: 'infrastructure',
      owner: 'dev-team',
      orgName: 'Development Team',
      language: 'YAML',
      lastUpdated: '12 days ago',
      packageTypes: ['docker'],
      isConfigured: false,
      workflows: []
    }
  ]);

  // Mock organizations data
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 'org1', name: 'ACME Organization' },
    { id: 'org2', name: 'Development Team' },
    { id: 'org3', name: 'Personal Account' }
  ]);

  const [selectedOrg, setSelectedOrg] = useState<Organization>(organizations[0]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  
  const handleConfigureRepository = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="animate-fadeIn">
          <RepositoryHeader 
            organizations={organizations}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
          />
          
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold mr-3">GitHub Repositories</h2>
                <OrganizationSelect 
                  organizations={organizations}
                  selectedOrg={selectedOrg}
                  setSelectedOrg={setSelectedOrg}
                />
              </div>
            </div>
            
            <RepositoryList 
              repositories={repositories}
              onConfigureRepository={handleConfigureRepository}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoriesPage;

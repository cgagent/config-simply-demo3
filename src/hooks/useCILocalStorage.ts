import { useState, useEffect, useCallback } from 'react';
import { Repository, PackageType, Workflow, SupportedLanguage } from '@/types/repository';
import { PackageStatistics, BlockedPackage, defaultPackageStatistics, defaultBlockedPackages, LatestPackage } from '@/types/package';

const STORAGE_KEY = 'ci_repositories';
const PACKAGE_STATS_KEY = 'package_statistics';
const BLOCKED_PACKAGES_KEY = 'blocked_packages';

/**
 * Creates an empty package type status record
 */
const createEmptyPackageTypeStatus = (): Record<PackageType, boolean> => ({
  npm: false,
  maven: false,
  docker: false,
  python: false,
  debian: false,
  rpm: false
});

/**
 * Default demo repositories for initial state
 */
const defaultRepositories: Repository[] = [
  {
    id: '1',
    name: 'infrastructure',
    owner: 'dev-team',
    orgName: 'Development Team',
    language: 'YAML',
    lastUpdated: '12 days ago',
    packageTypes: [],
    isConfigured: false,
    workflows: []
  },
  {
    id: '2',
    name: 'frontend-app',
    owner: 'acme-org',
    orgName: 'ACME Organization',
    language: 'TypeScript',
    lastUpdated: '2 days ago',
    packageTypes: ['npm', 'docker'],
    isConfigured: true,
    packageTypeStatus: {
      current: {
        ...createEmptyPackageTypeStatus(),
        npm: true,
        docker: true
      },
      previous: createEmptyPackageTypeStatus(),
      showTransition: false
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
    id: '3',
    name: 'backend-api',
    owner: 'acme-org',
    orgName: 'ACME Organization',
    language: 'JavaScript',
    lastUpdated: '5 days ago',
    packageTypes: ['npm', 'python', 'docker'],
    isConfigured: true,
    packageTypeStatus: {
      current: {
        ...createEmptyPackageTypeStatus(),
        npm: true,
        python: true,
        docker: true
      },
      previous: createEmptyPackageTypeStatus(),
      showTransition: false
    },
    workflows: [
      { 
        id: 'w3', 
        name: 'Database Migrations', 
        status: 'active',
        buildNumber: 76,
        lastRun: '5 days ago',
        packageTypes: ['npm', 'python', 'docker']
      }
    ]
  }
];

/**
 * Custom hook for managing CI repository data in localStorage
 */
export const useCILocalStorage = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultRepositories;
      
      // Parse stored repositories
      const parsedRepositories = JSON.parse(stored);
      
      // Ensure infrastructure repository is not configured
      const updatedRepositories = parsedRepositories.map((repo: Repository) => {
        if (repo.name === 'infrastructure') {
          return {
            ...repo,
            isConfigured: false,
            packageTypes: [],
            workflows: [],
            packageTypeStatus: undefined
          };
        }
        return repo;
      });
      
      return updatedRepositories;
    } catch (error) {
      console.error('Error loading repositories from localStorage:', error);
      return defaultRepositories;
    }
  });

  // Add package statistics and blocked packages state
  const [packageStats, setPackageStats] = useState<PackageStatistics>(defaultPackageStatistics);
  const [blockedPackages, setBlockedPackages] = useState<BlockedPackage[]>(defaultBlockedPackages);

  // Save to localStorage whenever repositories change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(repositories));
    } catch (error) {
      console.error('Error saving repositories to localStorage:', error);
    }
  }, [repositories]);

  // Save package statistics and blocked packages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PACKAGE_STATS_KEY, JSON.stringify(packageStats));
    } catch (error) {
      console.error('Error saving package statistics to localStorage:', error);
    }
  }, [packageStats]);

  useEffect(() => {
    try {
      localStorage.setItem(BLOCKED_PACKAGES_KEY, JSON.stringify(blockedPackages));
    } catch (error) {
      console.error('Error saving blocked packages to localStorage:', error);
    }
  }, [blockedPackages]);

  // Load package statistics and blocked packages from localStorage on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(PACKAGE_STATS_KEY);
      const storedBlocked = localStorage.getItem(BLOCKED_PACKAGES_KEY);
      
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats);
        // Ensure latestPackages exists in the parsed stats
        if (!parsedStats.latestPackages) {
          parsedStats.latestPackages = defaultPackageStatistics.latestPackages;
        }
        setPackageStats(parsedStats);
      }
      
      if (storedBlocked) {
        setBlockedPackages(JSON.parse(storedBlocked));
      }
    } catch (error) {
      console.error('Error loading package data from localStorage:', error);
    }
  }, []);

  /**
   * Creates a new workflow for a package type
   */
  const createWorkflow = useCallback((packageType: PackageType): Workflow => ({
    id: `w${Date.now()}`,
    name: `workflow-${packageType}.yml`,
    status: 'active',
    buildNumber: 1,
    lastRun: 'Just now',
    packageTypes: [packageType]
  }), []);

  /**
   * Updates the status of a repository's package type
   */
  const updateRepositoryStatus = useCallback((repoName: string, packageType: PackageType) => {
    setRepositories(prevRepositories => {
      return prevRepositories.map(repo => {
        if (repo.name === repoName) {
          const currentStatus = repo.packageTypeStatus?.current || createEmptyPackageTypeStatus();
          const previousStatus = { ...currentStatus };
          
          // Update current status
          const updatedCurrentStatus = {
            ...currentStatus,
            [packageType]: true
          };
          
          // Update package types array
          const updatedPackageTypes = repo.packageTypes?.includes(packageType)
            ? repo.packageTypes
            : [...(repo.packageTypes || []), packageType];
          
          // Create or update workflows
          const hasWorkflow = repo.workflows?.some(w => w.packageTypes?.includes(packageType));
          const updatedWorkflows = hasWorkflow
            ? repo.workflows
            : [...(repo.workflows || []), createWorkflow(packageType)];
          
          return {
            ...repo,
            isConfigured: true,
            packageTypes: updatedPackageTypes,
            packageTypeStatus: {
              current: updatedCurrentStatus,
              previous: previousStatus,
              showTransition: true
            },
            lastUpdated: 'Today',
            workflows: updatedWorkflows
          };
        }
        return repo;
      });
    });
  }, [createWorkflow]);

  /**
   * Adds a new repository to the list
   */
  const addRepository = useCallback((repository: Repository) => {
    setRepositories(prev => {
      if (prev.some(repo => repo.name === repository.name)) {
        console.warn(`Repository ${repository.name} already exists. Add operation skipped.`);
        return prev;
      }
      return [...prev, repository];
    });
  }, []);

  /**
   * Removes a repository from the list
   */
  const removeRepository = useCallback((repoName: string) => {
    setRepositories(prev => prev.filter(repo => repo.name !== repoName));
  }, []);

  /**
   * Adds a new latest package to the list
   */
  const addLatestPackage = useCallback((latestPackage: LatestPackage) => {
    setPackageStats(prev => {
      // Create a new array with the new package at the beginning
      const updatedLatestPackages = [latestPackage, ...prev.latestPackages];
      
      // Limit to the 5 most recent packages
      const limitedLatestPackages = updatedLatestPackages.slice(0, 5);
      
      return {
        ...prev,
        latestPackages: limitedLatestPackages
      };
    });
  }, []);

  return {
    repositories,
    updateRepositoryStatus,
    addRepository,
    removeRepository,
    packageStats,
    setPackageStats,
    blockedPackages,
    setBlockedPackages,
    addLatestPackage
  };
}; 
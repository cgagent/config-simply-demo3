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
 * Generate demo repositories for initial state
 */
const generateDemoRepositories = (): Repository[] => {
  return [...defaultRepositories];
};

/**
 * Generate demo package statistics for initial state
 */
const generateDemoPackageStats = (): PackageStatistics => {
  return {...defaultPackageStatistics};
};

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

  // Load demo data if there's nothing in storage
  useEffect(() => {
    let shouldSetDemoData = false;
    let storedRepos: string | null = null;
    let storedPackageStats: string | null = null;

    try {
      // Check if we have repositories data
      storedRepos = localStorage.getItem(STORAGE_KEY);
      storedPackageStats = localStorage.getItem(PACKAGE_STATS_KEY);

      if (!storedRepos || !storedPackageStats) {
        shouldSetDemoData = true;
      }

      // Load data if it exists
      if (storedRepos) {
        setRepositories(JSON.parse(storedRepos));
      }
      if (storedPackageStats) {
        setPackageStats(JSON.parse(storedPackageStats));
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      shouldSetDemoData = true;
    }

    // Set demo data if needed
    if (shouldSetDemoData) {
      console.log('Setting demo data...');
      const demoRepos = generateDemoRepositories();
      const demoPackageStats = generateDemoPackageStats();

      // Always update with our new custom package data
      const updateWithCustomPackages = (existingData: PackageStatistics) => {
        console.log('Updating with custom packages...');
        
        // Create new package data with specified timestamps
        const now = new Date();
        const newPackages: LatestPackage[] = [
          {
            id: crypto.randomUUID(),
            name: "frontend-app",
            version: "2.4.0",
            type: "docker",
            releaseDate: new Date(now.getTime() - (30 * 1000)).toISOString(), // 30 seconds ago
            repository: "frontend-app",
            status: "passed"
          },
          {
            id: crypto.randomUUID(),
            name: "user-service",
            version: "1.7.3",
            type: "docker",
            releaseDate: new Date(now.getTime() - (3 * 60 * 60 * 1000)).toISOString(), // 3 hours ago
            repository: "user-service",
            status: "passed"
          },
          {
            id: crypto.randomUUID(),
            name: "analytics-dashboard",
            version: "0.9.1",
            type: "npm",
            releaseDate: new Date(now.getTime() - (12 * 60 * 60 * 1000)).toISOString(), // 12 hours ago
            repository: "analytics",
            status: "warning"
          },
          {
            id: crypto.randomUUID(),
            name: "infra-utilities",
            version: "3.1.0",
            type: "npm",
            releaseDate: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString(), // 1 day ago
            repository: "infrastructure",
            status: "passed"
          },
          {
            id: crypto.randomUUID(),
            name: "api-gateway",
            version: "1.0.0",
            type: "docker",
            releaseDate: new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString(), // 3 days ago
            repository: "api-gateway",
            status: "passed"
          }
        ];

        // Combine with existing packages and sort by release date (newest first)
        const combinedPackages = [...newPackages, ...existingData.latestPackages].sort((a, b) => {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });

        // Calculate packages by type
        const packageTypes = combinedPackages.reduce((acc, pkg) => {
          if (pkg.type === 'docker') acc.docker++;
          else if (pkg.type === 'maven') acc.maven++;
          else if (pkg.type === 'npm') acc.npm++;
          return acc;
        }, { docker: 0, maven: 0, npm: 0 });

        return {
          ...existingData,
          latestPackages: combinedPackages,
          packageTypeCounts: packageTypes,
          totalPackages: combinedPackages.length
        };
      };

      // Update existing package stats or set new demo data with custom packages
      if (storedPackageStats) {
        try {
          const parsedStats = JSON.parse(storedPackageStats);
          const updatedStats = updateWithCustomPackages(parsedStats);
          setPackageStats(updatedStats);
          console.log('Updated existing package stats with custom packages:', updatedStats);
        } catch (e) {
          console.error('Error updating existing package stats:', e);
          const updatedDefaultStats = updateWithCustomPackages(demoPackageStats);
          setPackageStats(updatedDefaultStats);
        }
      } else {
        const updatedDefaultStats = updateWithCustomPackages(demoPackageStats);
        setPackageStats(updatedDefaultStats);
        console.log('Set new demo package stats with custom packages:', updatedDefaultStats);
      }

      setRepositories(demoRepos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoRepos));
      localStorage.setItem(PACKAGE_STATS_KEY, JSON.stringify(packageStats));
      localStorage.setItem(BLOCKED_PACKAGES_KEY, JSON.stringify(defaultBlockedPackages));
    }
  }, []);

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
            [packageType]: !currentStatus[packageType]
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
            isConfigured: updatedPackageTypes.length > 0,
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

  /**
   * Adds a new build to the latest builds list
   */
  const addLatestBuild = useCallback((build: PackageStatistics['latestBuilds'][0]) => {
    setPackageStats(prev => {
      // Create a new array with the new build at the beginning
      const updatedLatestBuilds = [build, ...prev.latestBuilds];
      
      // Limit to the 5 most recent builds
      const limitedLatestBuilds = updatedLatestBuilds.slice(0, 5);
      
      return {
        ...prev,
        latestBuilds: limitedLatestBuilds
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
    addLatestPackage,
    addLatestBuild
  };
}; 
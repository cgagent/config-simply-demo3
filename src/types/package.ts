export interface Package {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  vulnerabilities: number;
  downloads: number;
  size: number; // in bytes
}

export interface LatestPackage {
  id: string;
  name: string;
  version: string;
  type: string;
  releaseDate: string;
  repository: string;
  status: 'passed' | 'warning' | 'failed';
}

export interface BlockedPackage {
  id: string;
  name: string;
  type: string;
  blockedAt: string;
  reason: string;
}

export interface PackageStatistics {
  totalPackages: number;
  blockedPackages: number;
  dataConsumption: number;
  packageTypeCounts: {
    docker: number;
    maven: number;
    npm: number;
  };
  riskyPackages: {
    name: string;
    version: string;
    vulnerability: string;
    severity: string;
    affectedRepos: string[];
  }[];
  latestPackages: LatestPackage[];
}

// Default demo data
export const defaultPackageStatistics: PackageStatistics = {
  totalPackages: 154,
  blockedPackages: 3,
  dataConsumption: 1528,
  packageTypeCounts: {
    docker: 3,
    maven: 8,
    npm: 12
  },
  riskyPackages: [
    {
      name: 'axios',
      version: '1.5.1',
      vulnerability: 'CVE-2024-39338',
      severity: 'Critical',
      affectedRepos: ['ACME/frontend-app', 'ACME/backend-api']
    }
  ],
  latestPackages: [
    {
      id: '1',
      name: 'frontend-app',
      version: '1.2.3',
      type: 'npm',
      releaseDate: '2024-06-15T14:30:00Z',
      repository: 'production',
      status: 'passed'
    },
    {
      id: '2',
      name: 'backend-api',
      version: '2.0.1',
      type: 'maven',
      releaseDate: '2025-04-14T10:15:00Z',
      repository: 'staging',
      status: 'warning'
    },
    {
      id: '3',
      name: 'shared-components',
      version: '0.5.0',
      type: 'npm',
      releaseDate: '2024-06-13T16:45:00Z',
      repository: 'production',
      status: 'passed'
    },
    // {
    //   id: '4',
    //   name: 'infrastructure',
    //   version: '1.0.0',
    //   type: 'docker',
    //   releaseDate: '2024-06-12T09:30:00Z',
    //   repository: 'production',
    //   status: 'passed'
    // },
    // {
    //   id: '5',
    //   name: 'data-processor',
    //   version: '0.8.2',
    //   type: 'python',
    //   releaseDate: '2024-06-11T11:20:00Z',
    //   repository: 'staging',
    //   status: 'failed'
    // }
  ]
};

export const defaultBlockedPackages: BlockedPackage[] = [
  {
    id: '1',
    name: 'evil-package-101',
    type: 'npm',
    blockedAt: '2024-03-15T10:00:00Z',
    reason: 'Attempted to steal user credentials'
  },
  {
    id: '2',
    name: 'malware-lib',
    type: 'npm',
    blockedAt: '2024-03-10T15:30:00Z',
    reason: 'Contained scripts to inject ransomware'
  },
  {
    id: '3',
    name: 'bad-actor-addon',
    type: 'npm',
    blockedAt: '2024-03-05T09:15:00Z',
    reason: 'Had a payload to exfiltrate private data'
  }
];

export const packageTypeColors: Record<string, string> = {
  npm: 'bg-red-500',
  docker: 'bg-blue-500',
  python: 'bg-green-500',
  maven: 'bg-orange-500',
  debian: 'bg-yellow-500',
  rpm: 'bg-pink-500',
  nuget: 'bg-purple-500',
  default: 'bg-gray-500'
};

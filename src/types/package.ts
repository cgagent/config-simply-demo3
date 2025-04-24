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
  latestBuilds: {
    id: string;
    repository: string;
    buildNumber: string;
    status: 'passed' | 'warning' | 'failed';
    buildDate: string;
  }[];
}

// Default demo data
export const defaultPackageStatistics: PackageStatistics = {
  totalPackages: 154,
  blockedPackages: 3,
  dataConsumption: 1024 * 1024 * 1024 * 2.5, // 2.5 GB
  packageTypeCounts: {
    docker: 45,
    maven: 67,
    npm: 42
  },
  riskyPackages: [
    {
      name: "lodash",
      version: "4.17.15",
      vulnerability: "CVE-2021-23337",
      severity: "high",
      affectedRepos: ["frontend-app", "common"]
    }
  ],
  latestPackages: [
    {
      id: "1",
      name: "frontend-app",
      version: "2.4.0",
      type: "docker",
      releaseDate: new Date(new Date().getTime() - (30 * 1000)).toISOString(),
      repository: "frontend-app",
      status: "passed"
    },
    {
      id: "2",
      name: "user-service",
      version: "1.7.3",
      type: "docker",
      releaseDate: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString(),
      repository: "user-service",
      status: "passed"
    },
    {
      id: "3",
      name: "analytics-dashboard",
      version: "0.9.1",
      type: "npm",
      releaseDate: new Date(new Date().getTime() - (12 * 60 * 60 * 1000)).toISOString(),
      repository: "analytics",
      status: "warning"
    },
    {
      id: "4",
      name: "infra-utilities",
      version: "3.1.0",
      type: "npm",
      releaseDate: new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
      repository: "infrastructure",
      status: "passed"
    },
    {
      id: "5",
      name: "api-gateway",
      version: "1.0.0",
      type: "docker",
      releaseDate: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
      repository: "api-gateway",
      status: "passed"
    }
  ],
  latestBuilds: [
    {
      id: "1",
      repository: "frontend-app",
      buildNumber: "1234",
      status: "passed",
      buildDate: new Date().toISOString()
    }
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

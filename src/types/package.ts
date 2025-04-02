export interface Package {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  vulnerabilities: number;
  downloads: number;
  size: number; // in bytes
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
}

// Default demo data
export const defaultPackageStatistics: PackageStatistics = {
  totalPackages: 154,
  blockedPackages: 3,
  dataConsumption: 1528,
  packageTypeCounts: {
    docker: 20,
    maven: 14,
    npm: 120
  },
  riskyPackages: [
    {
      name: 'axios',
      version: '1.5.1',
      vulnerability: 'CVE-2024-39338',
      severity: 'High',
      affectedRepos: ['ACME/frontend-app', 'ACME/backend-api']
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

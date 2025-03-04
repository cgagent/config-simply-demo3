
export interface Workflow {
  id: string; 
  name: string; 
  status: 'active' | 'inactive';
  buildNumber?: number;
  lastRun?: string;
  packageTypes?: string[];
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  isConfigured: boolean;
  language: string;
  lastUpdated: string;
  packageTypes?: string[];
  lastRun?: string;
  orgName?: string;
  workflows?: Workflow[];
  packageTypeStatus?: Record<string, boolean>;
}

export const languageColors: Record<string, string> = {
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

export const commonPackageTypes = ['npm', 'docker', 'python', 'maven', 'debian', 'rpm'];

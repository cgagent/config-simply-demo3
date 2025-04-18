export interface ReleasePackage {
  name: string;
  version: string;
  repository: string;
  branch: string;
  environment: 'staging' | 'production';
  type: 'npm' | 'maven' | 'docker' | 'python' | 'debian' | 'rpm';
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused';
  vulnerabilities?: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    package: string;
    currentVersion: string;
    recommendedVersion: string;
    description: string;
  }[];
  steps: {
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    message?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseStep {
  id: string;
  name: string;
  description: string;
  command?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  output?: string;
  error?: string;
}

export interface ReleaseVulnerability {
  id: string;
  package: string;
  currentVersion: string;
  recommendedVersion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cve?: string;
  affectedRepos?: string[];
} 
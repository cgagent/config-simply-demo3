import { ReleasePackage, ReleaseStep, ReleaseVulnerability } from '../types/releaseTypes';

export const releasePatterns = {
  // Package patterns
  packageName: /^[a-zA-Z0-9-_.]+$/,
  version: /^\d+\.\d+\.\d+$/,
  branch: /^[a-zA-Z0-9-_.]+$/,
  environment: /^(dev|staging|prod)$/,
  type: /^(major|minor|patch)$/,

  // Step patterns
  stepId: /^[a-zA-Z0-9-]+$/,
  stepStatus: /^(pending|running|completed|failed)$/,

  // Vulnerability patterns
  vulnerabilityId: /^[a-zA-Z0-9-]+$/,
  severity: /^(critical|high|medium|low)$/,
  cve: /^CVE-\d{4}-\d{4,7}$/,
};

export const validatePackage = (pkg: ReleasePackage): boolean => {
  return (
    releasePatterns.packageName.test(pkg.name) &&
    releasePatterns.version.test(pkg.version) &&
    releasePatterns.branch.test(pkg.branch) &&
    releasePatterns.environment.test(pkg.environment) &&
    releasePatterns.type.test(pkg.type)
  );
};

export const validateStep = (step: ReleaseStep): boolean => {
  return (
    releasePatterns.stepId.test(step.id) &&
    releasePatterns.stepStatus.test(step.status)
  );
};

export const validateVulnerability = (vulnerability: ReleaseVulnerability): boolean => {
  return (
    releasePatterns.vulnerabilityId.test(vulnerability.id) &&
    releasePatterns.severity.test(vulnerability.severity) &&
    (vulnerability.cve ? releasePatterns.cve.test(vulnerability.cve) : true)
  );
}; 
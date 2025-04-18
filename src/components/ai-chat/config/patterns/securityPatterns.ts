import { SECURITY_REMEDIATION_PATTERNS, getAllSecurityRemediationPatterns } from '../constants/securityConstants';

/**
 * Patterns for security risk identification
 */
export const SECURITY_RISK_PATTERNS = {
  identify: [
    'identify which packages are at risk',
    'packages at risk in my organization',
    'security risk in my organization',
    'vulnerable packages in my organization',
    'security vulnerabilities in my organization',
    'package vulnerabilities in my organization',
    'are at risk in my organization',
    'packages at risk',
    'security risk',
    'vulnerable packages',
    'security vulnerabilities',
    'package vulnerabilities'
  ]
} as const;

// Re-export the security remediation patterns from the constants file
export { SECURITY_REMEDIATION_PATTERNS, getAllSecurityRemediationPatterns };

/**
 * Get all security risk patterns as a flat array
 */
export const getAllSecurityRiskPatterns = (): string[] => {
  return Object.values(SECURITY_RISK_PATTERNS).flat();
};

/**
 * Security risk patterns
 */
export const securityRiskPatterns = {
  identifyRisk: [
    "identify which packages are at risk",
    "vulnerable packages in my organization",
    "security vulnerabilities in packages",
    "packages with security issues",
    "malicious packages",
    "blocked packages"
  ],
  remediationActionSelection: [
    "create a git issue for this vulnerability",
    "notify in slack about this vulnerability",
    "send an email about this vulnerability"
  ],
  maliciousPackages: [
    "which packages were blocked in the last two weeks",
    "show me the malicious packages",
    "list blocked packages",
    "packages at risk",
    "security vulnerabilities"
  ]
}; 
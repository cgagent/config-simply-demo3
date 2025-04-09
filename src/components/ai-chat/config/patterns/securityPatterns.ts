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

/**
 * Patterns for security remediation actions
 */
export const SECURITY_REMIDIATION_PATTERNS = {
  git: ['git issue', 'create git issue'],
  email: ['email yahavi@acme.com', 'ping yahavi@acme.com'],
  slack: ['slack', 'ping in slack', 'notify in slack']
} as const;

/**
 * Get all security risk patterns as a flat array
 */
export const getAllSecurityRiskPatterns = (): string[] => {
  return Object.values(SECURITY_RISK_PATTERNS).flat();
};

/**
 * Get all security remediation patterns as a flat array
 */
export const getAllSecurityRemediationPatterns = (): string[] => {
  return Object.values(SECURITY_REMIDIATION_PATTERNS).flat();
}; 
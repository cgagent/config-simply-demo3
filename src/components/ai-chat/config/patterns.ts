/**
 * Pattern matching configuration for the AI chat
 */
export const patterns = {
  // CI/CD related patterns
  ciSetup: {
    keywords: ['ci', 'cd', 'pipeline', 'jenkins', 'github actions', 'gitlab ci', 'circleci'],
    intent: 'ci_setup'
  },
  securityRisk: {
    keywords: ['security', 'vulnerability', 'risk', 'scan', 'check', 'audit'],
    intent: 'security_risk'
  }
}; 
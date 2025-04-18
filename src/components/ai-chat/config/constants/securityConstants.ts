import { ChatOption } from '@/components/shared/types';

/**
 * Security remediation action types
 */
export const SECURITY_REMEDIATION_ACTIONS = {
  GIT: 'git',
  SLACK: 'slack',
  EMAIL: 'email'
} as const;

/**
 * Security remediation options for UI selection
 */
export const securityRemediationOptions: ChatOption[] = [
  { 
    id: SECURITY_REMEDIATION_ACTIONS.GIT, 
    label: 'Create Git Issue', 
    value: 'I want to create a git issue for this vulnerability' 
  },
  { 
    id: SECURITY_REMEDIATION_ACTIONS.SLACK, 
    label: 'Notify in Slack', 
    value: 'I want to notify in slack about this vulnerability' 
  },
  { 
    id: SECURITY_REMEDIATION_ACTIONS.EMAIL, 
    label: 'Send Email', 
    value: 'I want to send an email about this vulnerability' 
  }
];

/**
 * Patterns for security remediation actions
 */
export const SECURITY_REMEDIATION_PATTERNS = {
  [SECURITY_REMEDIATION_ACTIONS.GIT]: ['git issue', 'create git issue'],
  [SECURITY_REMEDIATION_ACTIONS.EMAIL]: ['email yahavi@acme.com', 'ping yahavi@acme.com'],
  [SECURITY_REMEDIATION_ACTIONS.SLACK]: ['slack', 'ping in slack', 'notify in slack']
} as const;

/**
 * Get all security remediation patterns as a flat array
 */
export const getAllSecurityRemediationPatterns = (): string[] => {
  return Object.values(SECURITY_REMEDIATION_PATTERNS).flat();
}; 
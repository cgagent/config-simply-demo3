import { ConversationFlow } from '../../utils/types';
import { securityRiskPatterns } from '../patterns/securityPatterns';
import { securityRiskResponses } from '../responses/securityResponses';
import { securityRemediationOptions } from '../constants/securityConstants';

/**
 * Security risk flow
 */
export const securityRiskFlow: ConversationFlow = {
  id: 'security-risk',
  name: 'Security Risk',
  steps: [
    {
      id: 'identify-risk',
      patterns: securityRiskPatterns.identifyRisk,
      response: securityRiskResponses.identifyRisk,
      nextSteps: ['remediation-action-selection']
    },
    {
      id: 'remediation-action-selection',
      patterns: securityRiskPatterns.remediationActionSelection,
      response: securityRiskResponses.remediationActionSelection
    }
  ]
};

/**
 * Malicious packages flow
 */
export const maliciousPackagesFlow: ConversationFlow = {
  id: 'malicious-packages',
  name: 'Malicious Packages',
  steps: [
    {
      id: 'packages-at-risk',
      patterns: securityRiskPatterns.maliciousPackages,
      response: securityRiskResponses.maliciousPackages,
      nextSteps: ['remediation-action-selection']
    },
    {
      id: 'remediation-action-selection',
      patterns: securityRiskPatterns.remediationActionSelection,
      response: securityRiskResponses.remediationActionSelection
    }
  ]
}; 
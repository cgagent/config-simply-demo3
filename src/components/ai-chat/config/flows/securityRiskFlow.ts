import { ConversationFlow } from '../../utils/types';
import { getAllSecurityRiskPatterns, getAllSecurityRemediationPatterns } from '../patterns/securityPatterns';
import { securityRiskResponses } from '../responses/securityResponses';

/**
 * Security risk conversation flow
 */
export const securityRiskFlow: ConversationFlow = {
  id: 'security-risk',
  name: 'Security Risk Flow',
  steps: [
    {
      id: 'identify-risk',
      patterns: getAllSecurityRiskPatterns(),
      response: securityRiskResponses.identifyRisk,
      nextSteps: ['remediation-action-selection']
    },
    {
      id: 'remediation-action-selection',
      patterns: getAllSecurityRemediationPatterns(),
      response: securityRiskResponses.remediationActionSelection
    }
  ]
}; 
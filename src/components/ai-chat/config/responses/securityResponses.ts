import { ChatResponseContent } from '../../utils/types';
import { ChatOption } from '../../../ai-configuration/types';

/**
 * Generates a response for security remediation actions
 */
export const generateSecurityRemediationResponse = (action: string): string => {
  switch (action) {
    case 'git':
      return "Creating a Git issue for yahavi@acme.com to upgrade axios version in the ACME/frontend-app and ACME/backend-api repositories.";
    case 'email':
      return "Sending an email to yahavi@acme.com to upgrade axios version in the ACME/frontend-app and ACME/backend-api repositories.";
    case 'slack':
      return "Sending a Slack notification to *yahavi* about upgrading axios version in the ACME/frontend-app and ACME/backend-api repositories.";
    default:
      return "I'll help you address this security vulnerability. Would you like to create a Git issue, send an email, or notify in Slack?";
  }
};

/**
 * Generates a response for security risk identification
 */
export const generateSecurityRiskResponse = (): string => {
  return `# One package with risks was detected:

### 📦 axios
• **Used version:** 1.5.1
• **Latest version published:** 1.8.3
• **Downloaded by:** yahavi@acme.com
• **Affected git repositories:** ACME/frontend-app (branch: main), ACME/backend-api (branch: main)
• **Vulnerabilities:** CVE-2024-39338
• **Vulnerability description:** axios 1.5.1 allows SSRF via unexpected behavior where requests for path relative URLs get processed as protocol relative URLs
• **Severity:** Critical`;
};

/**
 * Security remediation options
 */
export const securityRemediationOptions: ChatOption[] = [
  { id: 'git', label: 'Create Git Issue', value: 'I want to create a Git issue for this vulnerability' },
  { id: 'slack', label: 'Notify in Slack', value: 'I want to notify in Slack about this vulnerability' },
  { id: 'email', label: 'Send Email', value: 'I want to send an email about this vulnerability' }
];

/**
 * Security risk flow responses
 */
export const securityRiskResponses = {
  identifyRisk: generateSecurityRiskResponse,
  remediationActionSelection: generateSecurityRemediationResponse
}; 
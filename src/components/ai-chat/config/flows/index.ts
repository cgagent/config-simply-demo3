import { ciSetupFlow } from './ciSetupFlow';
import { securityRiskFlow } from './securityRiskFlow';

/**
 * All conversation flows
 */
export const conversationFlows = {
  ciSetup: ciSetupFlow,
  securityRisk: securityRiskFlow
}; 
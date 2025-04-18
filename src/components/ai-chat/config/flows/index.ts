import { maliciousPackagesFlow } from './securityFlow';
import { securityRiskFlow } from './securityFlow';
import { configFlow } from './configFlow';
import { releaseFlow } from './releaseFlow';

/**
 * All conversation flows
 */
export const conversationFlows = [
  securityRiskFlow,
  maliciousPackagesFlow,
  configFlow,
  releaseFlow
]; 
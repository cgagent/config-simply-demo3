import { releaseFlow } from './releaseFlow';
import { packageFlow } from './packageFlow';
import { securityFlow, maliciousPackagesFlow } from './securityFlow';
import { tokenFlow } from './tokenFlow';
import { distributionFlow } from './distributionFlow';
import { configFlow, repoConfigureSimplyFlow } from './configFlow';
import { ConversationFlow } from '../../utils/types';

/**
 * Collection of all conversation flows
 */
export const conversationFlows: ConversationFlow[] = [
  releaseFlow,
  packageFlow,
  securityFlow,
  maliciousPackagesFlow,
  tokenFlow,
  distributionFlow,
  configFlow,
  repoConfigureSimplyFlow
]; 
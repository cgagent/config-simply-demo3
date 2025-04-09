import { ConversationFlow } from '../../utils/types';
import { getAllCIToolPatterns, getAllPackageManagerPatterns } from '../patterns/ciPatterns';
import { ciSetupResponses } from '../responses/ciResponses';

/**
 * CI setup conversation flow
 */
export const ciSetupFlow: ConversationFlow = {
  id: 'ci-setup',
  name: 'CI Setup Flow',
  steps: [
    {
      id: 'initial',
      patterns: ['set up my ci', 'set my ci', 'configure ci', 'setup ci'],
      response: ciSetupResponses.initial,
      nextSteps: ['ci-tool-selection']
    },
    {
      id: 'ci-tool-selection',
      patterns: getAllCIToolPatterns(),
      response: ciSetupResponses.ciToolSelection,
      nextSteps: ['package-manager-selection']
    },
    {
      id: 'package-manager-selection',
      patterns: getAllPackageManagerPatterns(),
      response: ciSetupResponses.packageManagerSelection
    }
  ]
}; 
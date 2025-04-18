import { ConversationFlow } from '../../utils/types';
import { releasePatterns } from '../patterns/releasePatterns';

/**
 * Release conversation flow
 */
export const releaseFlow: ConversationFlow = {
  id: 'release',
  name: 'Release Flow',
  steps: [
    {
      id: 'initial',
      patterns: ['release', 'new package', 'create package', 'publish package'],
      response: "I'll help you release a new package. Let's start by gathering some information about your package. What's the name of your package?",
      nextSteps: ['package-details']
    },
    {
      id: 'package-details',
      patterns: ['shared-components', 'frontend-app', 'backend-api'],
      response: "Great! Now, what version would you like to release? (Please use semantic versioning format, e.g., 1.0.0)",
      nextSteps: ['version-selection']
    },
    {
      id: 'version-selection',
      patterns: ['version', '1.2', '2.0', '0.6'],
      response: "Which branch should we release from?",
      nextSteps: ['branch-selection']
    },
    {
      id: 'branch-selection',
      patterns: ['branch', 'main', 'master', 'develop'],
      response: "Which environment should we release to? (dev/staging/prod)",
      nextSteps: ['environment-selection']
    },
    {
      id: 'environment-selection',
      patterns: ['dev', 'staging', 'prod', 'production'],
      response: "What type of release is this? (major/minor/patch)",
      nextSteps: ['release-type-selection']
    },
    {
      id: 'release-type-selection',
      patterns: ['major', 'minor', 'patch'],
      response: "Perfect! I'll help you create a release with these details. Would you like to proceed with the release?",
      nextSteps: ['confirmation']
    },
    {
      id: 'confirmation',
      patterns: ['yes', 'proceed', 'continue', 'confirm'],
      response: "I'll start the release process now. I'll create a release branch and set up the necessary configurations. You'll be notified once the release is complete."
    }
  ]
}; 
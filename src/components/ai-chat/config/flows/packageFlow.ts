import { ConversationFlow } from '../../utils/types';
import { PACKAGE_PATTERNS } from '../patterns/packagePatterns';
import { packageResponses } from '../responses/packageResponses';
import { useRepositories } from '@/contexts/RepositoryContext';
import { formatDistanceToNow } from 'date-fns';

// Flow ID for use with the flow state
export const PACKAGE_FLOW_ID = 'packages';

// Define follow-up question options for package table
export const packageFollowUpOptions = [
  { id: "search-specific", value: "Search for a specific package", label: "Search for a specific package" },
  { id: "search-npm", value: "Search for npm packages", label: "Search for npm packages" },
  { id: "frontend-details", value: "Show me more details on frontend-app package", label: "Details on frontend-app" }
];

/**
 * Package conversation flow
 */
export const packageFlow: ConversationFlow = {
  id: PACKAGE_FLOW_ID,
  name: 'Package Information Flow',
  steps: [
    {
      id: 'latest-packages',
      patterns: PACKAGE_PATTERNS.latestPackages,
      // Use a simple placeholder response that will trigger our special handling
      response: "SHOW_PACKAGES_TABLE",
      // Include actionOptions directly in this step - they'll be shown with the table
      actionOptions: packageFollowUpOptions,
      isEndOfFlow: true
    },
    {
      id: 'package-detail',
      patterns: PACKAGE_PATTERNS.packageDetail,
      response: "I'll show you the package details. Could you please specify which package you're interested in?",
      isEndOfFlow: true
    },
    {
      id: 'risk-packages',
      patterns: PACKAGE_PATTERNS.riskPackages,
      response: "Let me check for packages that are at risk in your organization...",
      isEndOfFlow: true
    }
  ]
}; 
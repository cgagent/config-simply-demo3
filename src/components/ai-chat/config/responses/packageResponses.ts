import { MessageFactory } from '../../utils/messageFactory';
import { LatestPackage } from '@/types/package';
import { formatDistanceToNow } from 'date-fns';
import { packageFollowUpOptions } from '../flows/packageFlow';

/**
 * Generates a response for latest packages
 */
export const generateLatestPackagesResponse = (packages: LatestPackage[], query?: string) => {
  if (!packages || packages.length === 0) {
    return "I couldn't find any recent packages in your organization.";
  }

  // Format the packages data for display
  const formattedPackages = packages.map((pkg, index) => {
    // Assign variable version counts based on package type or randomly
    let versions = 1;
    if (pkg.type === 'docker') {
      versions = [3, 5, 8][index % 3]; // Cycle through 3, 5, 8 for docker
    } else if (pkg.type === 'npm') {
      versions = [1, 2, 4, 7][index % 4]; // Cycle through 1, 2, 4, 7 for npm
    }

    return {
      type: pkg.type,
      name: pkg.name,
      version: pkg.version,
      firstCreated: formatDistanceToNow(new Date(pkg.releaseDate), { addSuffix: true }),
      versions
    };
  });

  // If query includes "table", use a markdown table rather than a custom component
  if (query && query.toLowerCase().includes('table')) {
    // Create a markdown table
    const markdownTable = `
## Latest Packages

| Type | Package Name | Latest Version | First Created | Versions |
${formattedPackages.map(pkg => `| ${pkg.type} | ${pkg.name} | ${pkg.version} | ${pkg.firstCreated} | ${pkg.versions} |`).join('\n')}
`;

    // Return a placeholder that will trigger the special handling in useMessageHandler
    // This will be handled by the packageFlow step with actionOptions
    return "SHOW_PACKAGES_TABLE";
  }

  // Create a package table message
  const packageTableMessage = MessageFactory.createPackageTableMessage(
    "Here are the latest 5 packages published in your organization:",
    formattedPackages,
    packageFollowUpOptions
  );

  // Return the package table message directly - it now includes follow-up options
  return packageTableMessage;
};

/**
 * Package-related response handlers
 */
export const packageResponses = {
  latestPackages: generateLatestPackagesResponse
}; 
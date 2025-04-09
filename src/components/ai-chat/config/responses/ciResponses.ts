import { ChatResponseContent } from '../../utils/types';

/**
 * Type for package manager
 */
export type PackageManager = 'npm' | 'maven' | 'both';

/**
 * Generates a response for CI tool selection
 */
export const generateCIToolResponse = (tool: string): string => {
  if (tool.includes('github')) {
    return "I see you're using GitHub Actions. Would you like to set up CI for NPM, Maven, or both package types?";
  }
  return "For your CI system, we'll need to configure JFrog integration. Which package managers are you using in your project?";
};

/**
 * Generates a response for package manager selection
 */
export const generatePackageManagerResponse = (manager: PackageManager): string => {
  switch (manager) {
    case 'npm':
      return "Great! For NPM packages with JFrog, we'll need to set up authentication and repository configuration. Would you like to see a configuration example?";
    case 'maven':
      return "For Maven integration with JFrog, we'll need to update your pom.xml and settings.xml files. Would you like me to show you the necessary configurations?";
    case 'both':
      return "I'll help you set up both NPM and Maven with JFrog. Let's start with NPM configuration first. Would you like to see the configuration examples?";
  }
};

/**
 * CI setup flow responses
 */
export const ciSetupResponses = {
  initial: "Great, let's set up your CI to work with JFrog. Which CI tools are you using?",
  ciToolSelection: generateCIToolResponse,
  packageManagerSelection: generatePackageManagerResponse
}; 
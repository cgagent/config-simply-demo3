/**
 * Patterns for CI tool selection
 */
export const CI_TOOL_PATTERNS = {
  github: ['github actions', 'github'],
  jenkins: ['jenkins'],
  gitlab: ['gitlab'],
  travis: ['travis'],
  circle: ['circle'],
  other: ['other ci']
} as const;

/**
 * Patterns for package manager selection
 */
export const PACKAGE_MANAGER_PATTERNS = {
  npm: ['npm'],
  maven: ['maven'],
  both: ['both']
} as const;

/**
 * Get all CI tool patterns as a flat array
 */
export const getAllCIToolPatterns = (): string[] => {
  return Object.values(CI_TOOL_PATTERNS).flat();
};

/**
 * Get all package manager patterns as a flat array
 */
export const getAllPackageManagerPatterns = (): string[] => {
  return Object.values(PACKAGE_MANAGER_PATTERNS).flat();
}; 
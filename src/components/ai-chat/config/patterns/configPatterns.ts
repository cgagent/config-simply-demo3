/**
 * Patterns for configuration chat
 */
export const CONFIG_PATTERNS = {
  npm: ['npm', 'node', 'javascript', 'typescript'],
  docker: ['docker', 'container'],
  maven: ['maven', 'java'],
  pypi: ['pypi', 'python', 'pip'],
  github: ['github', 'github actions'],
  circleci: ['circleci', 'circle ci'],
  jenkins: ['jenkins'],
  gitlab: ['gitlab', 'gitlab ci'],
  merge: ['merge', 'merging', 'pull request'],
  abort: ['abort', 'cancel', 'stop'],
  viewDiff: ['view diff', 'see diff', 'check diff'],
  checkOnGithub: ['check on github', 'view on github', 'see on github'],
  // Simple repo configuration patterns
  simpleConfig: ['simple config', 'quick setup', 'configure simply', 'easy setup', 'repo config', 'simple repository'],
  // Authentication types
  tokenAuth: ['token auth', 'token authentication', 'use token', 'with token'],
  userPassAuth: ['username password', 'user pass', 'with credentials', 'login credentials'],
  // Configuration types
  simpleConfigType: ['simple configuration', 'basic setup', 'simple setup'],
  advancedConfigType: ['advanced configuration', 'advanced setup', 'complex setup'],
  // Actions
  proceed: ['proceed', 'continue', 'go ahead', 'do it', 'yes'],
  startOver: ['start over', 'restart', 'begin again', 'try again'],
  viewPR: ['view pr', 'view pull request', 'show pr', 'see changes'],
  mergePR: ['merge pr', 'merge pull request', 'accept changes']
} as const;

/**
 * Get all configuration patterns as a flat array
 */
export const getAllConfigPatterns = (): string[] => {
  return Object.values(CONFIG_PATTERNS).flat();
};

/**
 * Check if a query is a configuration query
 * @param content The query content to check
 * @returns Whether the query is a configuration query
 */
export const isConfigQuery = (content: string): boolean => {
  const lowerContent = content.toLowerCase().trim();
  
  return Object.values(CONFIG_PATTERNS).some(patterns => 
    patterns.some(pattern => lowerContent.includes(pattern)));
}; 
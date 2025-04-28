/**
 * Generates a response for npm configuration
 */
export const generateNpmResponse = (): string => {
  return `Great! I'll help you configure npm with JFrog. Let me create a pull request for your GitHub Actions workflow.`;
};

/**
 * Generates a response for Docker configuration
 */
export const generateDockerResponse = (): string => {
  return `I'll help you configure Docker with JFrog. Let me create a pull request for your GitHub Actions workflow.`;
};

/**
 * Generates a response for Maven configuration
 */
export const generateMavenResponse = (): string => {
  return `I'll help you configure Maven with JFrog. Let me create a pull request for your GitHub Actions workflow.`;
};

/**
 * Generates a response for PyPI configuration
 */
export const generatePyPIResponse = (): string => {
  return `I'll help you configure PyPI with JFrog. Let me create a pull request for your GitHub Actions workflow.`;
};

/**
 * Generates a response for GitHub Actions configuration
 */
export const generateGitHubResponse = (): string => {
  return `I'll help you configure GitHub Actions with JFrog. Let me create a pull request for your workflow.`;
};

/**
 * Generates a response for CircleCI configuration
 */
export const generateCircleCIResponse = (): string => {
  return `I'll help you configure CircleCI with JFrog. Let me create a pull request for your workflow.`;
};

/**
 * Generates a response for Jenkins configuration
 */
export const generateJenkinsResponse = (): string => {
  return `I'll help you configure Jenkins with JFrog. Let me create a pull request for your workflow.`;
};

/**
 * Generates a response for GitLab CI configuration
 */
export const generateGitLabResponse = (): string => {
  return `I'll help you configure GitLab CI with JFrog. Let me create a pull request for your workflow.`;
};

/**
 * Generates a response for merging a pull request
 */
export const generateMergeResponse = (): string => {
  return `Great! I'm merging the pull request to your main branch.`;
};

/**
 * Generates a response for aborting a pull request
 */
export const generateAbortResponse = (): string => {
  return `I've canceled the pull request. No changes have been made to your workflow.`;
};

/**
 * Generates a response for viewing a diff
 */
export const generateViewDiffResponse = (): string => {
  return `Here's the diff of the changes I'm proposing:`;
};

/**
 * Generates a response for checking on GitHub
 */
export const generateCheckOnGithubResponse = (): string => {
  return `I'll open the pull request on GitHub for you to review.`;
};

/**
 * Generates a response for simple repository configuration initial
 */
export const generateSimpleRepoConfigResponse = (): string => {
  return `Let me help you configure your repository with a simplified approach. I can help with common package managers:
  
• npm/JavaScript
• Docker
• Maven/Java
• PyPI/Python

Which package manager would you like to configure?`;
};

/**
 * Generates a response for npm repository configuration
 */
export const generateSimpleNpmConfigResponse = (): string => {
  return `For npm repositories, I can help you with:
  
1. Setting up authentication with tokens
2. Configuring .npmrc for your project
3. Setting up scoped registries

What would you like to configure?`;
};

/**
 * Generates a response for Docker repository configuration
 */
export const generateSimpleDockerConfigResponse = (): string => {
  return `For Docker repositories, I can help you with:
  
1. Setting up Docker registry authentication
2. Configuring your Dockerfile to use the registry
3. Setting up Docker Compose for multi-container applications

What would you like to configure?`;
};

/**
 * Generates a response for Maven repository configuration
 */
export const generateSimpleMavenConfigResponse = (): string => {
  return `For Maven repositories, I can help you with:
  
1. Configuring settings.xml for authentication
2. Setting up your pom.xml to use the repository
3. Configuring Maven profiles

What would you like to configure?`;
};

/**
 * Generates a response for PyPI repository configuration
 */
export const generateSimplePyPIConfigResponse = (): string => {
  return `For PyPI repositories, I can help you with:
  
1. Setting up .pypirc for authentication
2. Configuring pip.conf for your project
3. Setting up requirements.txt with your private dependencies

What would you like to configure?`;
};

/**
 * Configuration chat responses
 */
export const configResponses = {
  initial: "Let's set up your CI workflow with JFrog so your packages will be:\n\n⬇️  Downloaded from JFrog\n⬆️  Uploaded to JFrog\n🔍  Scanned for malicious packages\n\nI see you're using GitHub Actions and various package managers in your Git repository.\nLet's select the package managers you would like to configure from the list below:",
  npm: generateNpmResponse,
  docker: generateDockerResponse,
  maven: generateMavenResponse,
  pypi: generatePyPIResponse,
  github: generateGitHubResponse,
  circleci: generateCircleCIResponse,
  jenkins: generateJenkinsResponse,
  gitlab: generateGitLabResponse,
  merge: generateMergeResponse,
  abort: generateAbortResponse,
  viewDiff: generateViewDiffResponse,
  checkOnGithub: generateCheckOnGithubResponse,
  
  // Simple repository configuration responses
  simpleRepoConfig: generateSimpleRepoConfigResponse,
  simpleNpmConfig: generateSimpleNpmConfigResponse,
  simpleDockerConfig: generateSimpleDockerConfigResponse,
  simpleMavenConfig: generateSimpleMavenConfigResponse,
  simplePyPIConfig: generateSimplePyPIConfigResponse
}; 
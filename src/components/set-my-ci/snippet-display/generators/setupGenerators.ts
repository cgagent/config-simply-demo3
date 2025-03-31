
// Function to generate JFrog setup snippet based on CI system
export const generateJFrogSetupSnippet = (ciSystem: 'github' | 'other'): string => {
  if (ciSystem === 'github') {
    return `# Add this to your GitHub Actions workflow
- name: Setup JFrog
  uses: jfrog/setup-jfrog@v1
  with:
    subdomain: acme`;
  } else {
    return `# Add this to your CI configuration
# For Jenkins, GitLab CI, CircleCI, etc.
export JFROG_PLATFORM_URL="https://acme.jfrog.io"
export JFROG_API_KEY="YOUR_API_KEY"
`;
  }
};

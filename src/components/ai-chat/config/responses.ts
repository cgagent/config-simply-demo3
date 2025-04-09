/**
 * Response templates for the AI chat
 */
export const responses = {
  // CI/CD related responses
  ciSetup: {
    welcome: "I'll help you set up your CI/CD pipeline. Let's start by understanding your needs.",
    askPlatform: "Which CI/CD platform would you like to use? (Jenkins, GitHub Actions, GitLab CI, CircleCI)",
    askLanguage: "What programming language is your project using?",
    askFramework: "Which framework are you using? (React, Angular, Vue, etc.)",
    askTests: "Do you have automated tests? If yes, which testing framework do you use?",
    askDeploy: "Where do you want to deploy your application? (AWS, Azure, GCP, etc.)",
    success: "Great! I've created a CI/CD pipeline configuration for you. Here's what I've set up:",
    error: "I encountered an error while setting up your CI/CD pipeline. Let me help you troubleshoot."
  },
  securityRisk: {
    welcome: "I'll help you identify and address security risks in your codebase.",
    askScope: "What aspects of security would you like to focus on? (Dependencies, Code, Infrastructure)",
    askSeverity: "What level of security risk are you concerned about? (High, Medium, Low)",
    askFramework: "Which security scanning tools would you prefer? (Snyk, SonarQube, OWASP)",
    success: "I've analyzed your codebase for security risks. Here are my findings:",
    error: "I encountered an error while analyzing security risks. Let me help you troubleshoot."
  }
}; 
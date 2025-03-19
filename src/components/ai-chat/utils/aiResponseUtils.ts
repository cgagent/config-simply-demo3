/**
 * Simulate AI response (would be replaced with actual API call)
 */
export const simulateAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Add debug logging to help diagnose the issue
  console.log("Query evaluation:", {
    query: lowerQuery,
    containsHello: lowerQuery.includes('hello'),
    containsBlock: lowerQuery.includes('block'),
    exactMatch: lowerQuery === "which packages were blocked in the last two weeks?"
  });
  
  // Special case for CI setup query
  if (lowerQuery.includes('set up my ci') || lowerQuery.includes('set my ci') || lowerQuery.includes('configure ci')) {
    return "Great! I'm here to help you configure JFrog with your CI workflow. I see that you using GitHub Actions. and i see that you have several package managers in your git repository. Which package managers do you would like to configure?";
  }
  
  // Special case handling for blocked packages query (placed at the top to give it priority)
  if (
    lowerQuery === "which packages were blocked in the last two weeks?" || 
    lowerQuery === "blocked packages" || 
    lowerQuery === "show me the packages that are blocked" || 
    lowerQuery === "block" || 
    lowerQuery.includes('block') || 
    lowerQuery.includes('malicious')
  ) {
    console.log("Matched blocked packages query!");
    return `In the past 2 weeks, we blocked the following malicious npm packages:

evil-package-101: Attempted to steal user credentials.
malware-lib: Contained scripts to inject ransomware.
bad-actor-addon: Had a payload to exfiltrate private data.`;
  }
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Hello! How can I assist you today?";
  } 
  else if (lowerQuery.includes('repository') || lowerQuery.includes('repositories')) {
    return "Repositories are where your code lives. You can manage your repositories through the CI section of this application. Would you like to know more about setting up CI for your repositories?";
  }
  else if (lowerQuery.includes('ci') || lowerQuery.includes('continuous integration')) {
    return "Continuous Integration (CI) helps you automatically build, test, and validate code changes. Our CI tools integrate with your repositories to ensure code quality and streamline deployments. You can set up CI workflows in the CI section.";
  }
  else if (lowerQuery.includes('user') || lowerQuery.includes('account')) {
    return "User management allows you to control access to your organization's resources. You can add users, define roles, and set permissions in the User Management section.";
  }
  else if (lowerQuery.includes('popular package') || lowerQuery.includes('my organization') || lowerQuery.includes('secured')) {
    return `Here are the most popular packages used in your organization:

**axios**

- Most common version: 1.5.1 (published on 2024-08-31)

- Latest Version published: 1.8.3

- Your org version 1.5.1 has known vulnerabilities:

**CVE-2024-39338**

Description - axios 1.5.1 allows SSRF via unexpected behavior where requests for path relative URLs get processed as protocol relative URLs

Severity: High


**lodash**

- Most common version: 4.17.21

- Latest version: 4.17.21

- Your most common version is secured`;
  }
  else if (lowerQuery.includes('http request') || lowerQuery.includes('making http request')) {
    return `Here are 3 recommended npm packages for making HTTP requests:

1. **axios**

   • Description: Promise based HTTP client for the browser and node.js

   • Latest version: 1.8.3

   • [GitHub Repository](https://github.com/axios/axios)

   • [NPM Package Page](https://www.npmjs.com/package/axios)


2. **node-fetch**

   • Description: A light-weight module that brings window.fetch to node.js

   • Latest version: 3.3.2

   • [GitHub Repository](https://github.com/node-fetch/node-fetch)

   • [NPM Package Page](https://www.npmjs.com/package/node-fetch)


3. **request**

   • Description: Simplified HTTP request client

   • Latest version: 2.88.2

   • [GitHub Repository](https://github.com/request/request)

   • [Homepage](https://request.js.org/)`;
  }
  else if (lowerQuery.includes('sbom') || lowerQuery.includes('report for') || lowerQuery.includes('last 30 days')) {
    return `Here is the SBOM report for your packages from the last 30 days:

Package: lodash
Version: 4.17.21
License: MIT
Dependencies:
lodash._baseassign (3.2.0)
lodash._baseclone (3.3.0)
Package: axios
Version: 0.21.1
License: MIT
Dependencies:
follow-redirects (1.14.1)
Package: react
Version: 17.0.2
License: MIT
Dependencies:
loose-envify (1.4.0)
object-assign (4.1.1)`;
  }
  else if (lowerQuery === 'what is abc?') {
    return "ABC is a placeholder term often used as an example in software development. It can represent anything you'd like it to mean in your specific context. How would you like to define ABC for your project?";
  }
  else {
    return "I understand you're asking about \"" + query + "\". Let me provide some information about that. This is a simulated response in our demo application. In a production environment, this would connect to an AI language model API like OpenAI GPT, Anthropic Claude, or Perplexity to provide helpful and accurate responses.";
  }
};


/**
 * Simulate AI response (would be replaced with actual API call)
 */
export const simulateAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
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
  else {
    return "I understand you're asking about \"" + query + "\". Let me provide some information about that. This is a simulated response in our demo application. In a production environment, this would connect to an AI language model API like OpenAI GPT, Anthropic Claude, or Perplexity to provide helpful and accurate responses.";
  }
};

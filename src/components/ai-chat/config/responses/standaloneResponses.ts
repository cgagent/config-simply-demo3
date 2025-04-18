import { ChatResponse } from '../../utils/types';

/**
 * Standalone responses for common queries
 */
export const standaloneResponses: ChatResponse[] = [
  {
    id: 'blocked-packages',
    patterns: [
      'which packages were blocked in the last two weeks?',
      'blocked packages',
      'show me the packages that are blocked',
      'block',
      'malicious'
    ],
    response: `In the past 2 weeks, we blocked the following malicious npm packages:

evil-package-101: Attempted to steal user credentials.
malware-lib: Contained scripts to inject ransomware.
bad-actor-addon: Had a payload to exfiltrate private data.`
  },
  {
    id: 'greeting',
    patterns: ['hello', 'hi'],
    response: "Hello! How can I assist you today?"
  },
  {
    id: 'repository-info',
    patterns: ['repository', 'repositories'],
    response: "Repositories are where your code lives. You can manage your repositories through the CI section of this application. Would you like to know more about setting up CI for your repositories?"
  },
  {
    id: 'ci-info',
    patterns: ['ci', 'continuous integration'],
    response: "Continuous Integration (CI) helps you automatically build, test, and validate code changes. Our CI tools integrate with your repositories to ensure code quality and streamline deployments. You can set up CI workflows in the CI section."
  },
  {
    id: 'user-management',
    patterns: ['user', 'account'],
    response: "User management allows you to control access to your organization's resources. You can add users, define roles, and set permissions in the User Management section."
  },
  {
    id: 'http-request-packages',
    patterns: ['http request', 'making http request'],
    response: `Here are 3 recommended npm packages for making HTTP requests:

📦 **axios**
   
   • Description: Promise based HTTP client for the browser and node.js
   
   • Latest version: 1.8.3
   
   🔗 [GitHub Repository](https://github.com/axios/axios) 
   
   🔗 [NPM Package Page](https://www.npmjs.com/package/axios) 


📦 **node-fetch**
   
   • Description: A light-weight module that brings window.fetch to node.js
   
   • Latest version: 3.3.2
   
   🔗 [GitHub Repository](https://github.com/node-fetch/node-fetch) 
   
   🔗[NPM Package Page](https://www.npmjs.com/package/node-fetch) 


📦 **request**
   
   • Description: Simplified HTTP request client
   
   • Latest version: 2.88.2
   
   🔗 [GitHub Repository](https://github.com/request/request) 
   
   🔗 [NPM Package Page](https://www.npmjs.com/package/node-fetch) 

   ![Request Catalog](/lovable-uploads/req_catalog.png)`
  },
  {
    id: 'sbom-report',
    patterns: ['sbom', 'report for', 'last 30 days'],
    response: `Here is the SBOM report for your packages from the last 30 days:

Package: lodash1
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
object-assign (4.1.1)`
  }
]; 
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message, ChatOption } from '../types';
import React from 'react';

// Type for the navigation callback
type NavigationCallback = (path: string) => void;
// Type for the merge success callback
type MergeSuccessCallback = (repoName: string, packageType: string) => void;

export const useConfigChat = (
  repositoryName?: string,
  onNavigate?: NavigationCallback,
  onMergeSuccess?: MergeSuccessCallback
) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `Let's set up your CI workflow with JFrog so your packages will be:

⬇️  Downloaded from JFrog
⬆️  Uploaded to JFrog
🔍  Scanned for malicious packages

I see you're using GitHub Actions and various package managers in your Git repository.
Let's select the package managers you would like to configure from the list below:`
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ChatOption[]>([
    { id: 'npm', label: 'npm', value: 'Great! Let\'s configure your npm package manager' },
    { id: 'docker', label: 'Docker', value: 'I use Circle CI' },
    { id: 'maven', label: 'Maven', value: 'I use Jenkins' },
    { id: 'pypi', label: 'PyPi', value: 'I use GitLab CI' },
  ]);
  const { toast } = useToast();

  const handleSelectOption = (option: ChatOption) => {
    // If this is a check on GitHub request, just open the link in a new tab without further processing
    if (option.id === 'Check on GitHub') {
      window.open('https://github.com/yonarbel/demoid/pull/1/files', '_blank');
      return; // Return early without adding messages or processing further
    }

    // Use the selected option as the user's message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'bot',
      content: option.value
    };

    // Handle special actions like navigation
    if (option.id === 'view_diff') {
      setMessages(prev => [...prev, userMessage]);

      // Add a response acknowledging the navigation
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Taking you to the Repositories page...'
      };

      setMessages(prev => [...prev, botResponse]);

      // Navigate to Repositories page
      if (onNavigate) {
        onNavigate('/repositories');
      } else {
        toast({
          title: "Navigation not available",
          description: "The Repositories navigation is not available in this context.",
          variant: "destructive"
        });
      }

      return;
    }

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // If this is an npm configuration request, add a "working on it" message
    if (option.id === 'npm') {
      // Add a brief delay before showing the "working on it" message
  

      setIsProcessing(true);
      setTimeout(() => {
      
          const prMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: 'Creating a pull request for your GitHub Actions workflow....'
          };
          setMessages(prev => [...prev, prMessage]); 
      }, 5000);
      
    }

    // If this is a merge PR request, add merge-specific messages
    else if (option.id === 'Merge PR') {
   
        // Add a second update message
        setTimeout(() => {
          const updateMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'bot',
            content: 'Pull request approved! Setting up JFrog integration with your CI process...'
          };
          setMessages(prev => [...prev, updateMessage]);
        }, 2000);
    }

    // If this is an abort PR request, add abort confirmation message
    else if (option.id === 'Abort PR') {
      setTimeout(() => {
        const abortingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: 'Canceling the pull request...'
        };
        setMessages(prev => [...prev, abortingMessage]);
      }, 1500);
    }

    // Process the selected option
    processMessage(option.value);
  };

  const handleSendMessage = async () => {
    // This function is kept for compatibility but no longer uses input
    setIsProcessing(true);
    // You could add a default message here if needed
  };

  const generateNpmWebAppSnippet = () => {
    const repoName = repositoryName || 'your-webapp';

    return `name: NPM Web App CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${repoName}-build
          path: build/

      - name: Deploy to staging
        if: github.event_name != 'pull_request'
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here`;
  };

  const generateNpmWebAppWithJFrogSnippet = () => {
    const repoName = repositoryName || 'your-webapp';

    return `name: NPM Web App CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup JFrog
        uses: jfrog/setup-jfrog@v1
        with:
          subdomain: acme

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: publish npm package
        run: npm publish`;
  };

  const processMessage = (messageContent: string) => {
    // Check for merge PR requests
    if (messageContent.match(/Merging the pull request to your main branch/i)) {
      // Use a 4-second delay for the merge confirmation
      setTimeout(() => {
        // Success response after "merging" the PR
        const successResponse = `Congratulations! 🎉 The pull request has been successfully merged. Your workflow is now configured with JFrog 🐸

Your npm packages will now be:
✅ Downloaded from JFrog 
✅ Uploaded to JFrog
✅ Scanned for malicious packages

Your CI workflow is now fully integrated with JFrog!`;

        // Response with the success message
        const botResponse: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: successResponse
        };

        setMessages(prev => [...prev, botResponse]);

        // Update options to show what's next
        setOptions([
          { id: 'docker', label: 'Configure Docker', value: 'I also want to configure Docker' },
          { id: 'view_diff', label: 'My CI connection', value: 'I want to see the Repositories' },
          { id: 'done', label: 'That\'s all I need', value: 'Thanks, that\'s all I need for now' }
        ]);

        setIsProcessing(false);

        // Call onMergeSuccess callback if provided
        if (onMergeSuccess && repositoryName) {
          onMergeSuccess(repositoryName, 'npm');
        }
      }, 4000);

      return;
    }

    // Check for abort PR requests
    if (messageContent.match(/I want to abort the pull request/i)) {
      // Use a 2-second delay for the abort confirmation
      setTimeout(() => {
        // Abort response
        const abortResponse = `I've canceled the pull request. No changes have been made to your workflow.

Would you like to try a different configuration instead?`;

        // Response with the abort message
        const botResponse: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: abortResponse
        };

        setMessages(prev => [...prev, botResponse]);

        // Update options to show alternatives
        setOptions([
          { id: 'npm', label: 'Try npm again', value: "Let's try configuring npm again" },
          { id: 'docker', label: 'Configure Docker', value: 'I want to configure Docker instead' },
          { id: 'done', label: 'Cancel', value: 'I want to cancel the configuration' }
        ]);

        setIsProcessing(false);
      }, 2000);

      return;
    }

    // Check specifically for npm setup requests
    if (messageContent.match(/Great! Let\'s configure your npm package manager/i)) {
      const originalWorkflow = generateNpmWebAppSnippet();
      const modifiedWorkflow = generateNpmWebAppWithJFrogSnippet();

      // Create diff by comparing original and modified workflows
      const original = originalWorkflow.split('\n');
      const modified = modifiedWorkflow.split('\n');

      // Find the line index where JFrog setup is added
      const jfrogStartIndex = modified.findIndex(line => line.includes('Setup JFrog'));
      let jfrogEndIndex = jfrogStartIndex;

      // Find the end of the JFrog block (4 lines: name, uses, with, subdomain)
      if (jfrogStartIndex !== -1) {
        for (let i = jfrogStartIndex + 1; i < modified.length; i++) {
          if (modified[i].trim() === '') break;
          jfrogEndIndex = i;
        }
      }

      // Create the diff output
      let diffOutput = '';

      modified.forEach((line, index) => {
        // If this is part of the JFrog setup block, prefix with +
        if (index >= jfrogStartIndex && index <= jfrogEndIndex) {
          diffOutput += `+ ${line}\n`;
        } else {
          diffOutput += `  ${line}\n`;
        }
      });

      // Use a longer delay to ensure loading indicator shows
      setTimeout(() => {
        // Response content with a diff view
        const responseContent = `Great! I have created a pull request on your GitHub repository with the JFrog configuration for npm.
You can review the changes below:

\`\`\`diff
${diffOutput}
\`\`\`
Additionally, you can review the changes on GitHub, or simply merge the pull request directly from this chat.`;

        // Response with the diff view
        const botResponse: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: responseContent
        };

        setMessages(prev => [...prev, botResponse]);

        // Update options based on the response
        setOptions([
          { id: 'Check on GitHub', label: 'Check on GitHub', value: 'I want to check on GitHub' },
          { id: 'Merge PR', label: 'Merge PR', value: 'Merging the pull request to your main branch...' },
          { id: 'Abort PR', label: 'Abort PR', value: 'I want to abort the pull request' },
        ]);

        setIsProcessing(false);
      }, 9000);

      return;
    }

    // Determine if this is a CI configuration related message
    const isCIConfigMessage = /github|actions|circleci|jenkins|gitlab|azure|ci|pipeline/i.test(messageContent);

    // Use longer delay (2.5s) for CI config messages, standard delay (1.5s) for others
    const delay = isCIConfigMessage ? 2500 : 1500;

    // Simulate AI processing with setTimeout
    setTimeout(() => {
      try {
        let response = '';
        let newOptions: ChatOption[] = [];

        // Very simple rule-based responses for demo purposes
        if (/github|actions/i.test(messageContent)) {
          response = `Great! GitHub Actions is a popular choice. For your ${repositoryName || 'repository'}, you'll need to add the JFrog configuration to your workflow file. Which package managers do you use?`;
          newOptions = [
            { id: 'npm', label: 'npm', value: "Great! Let's configure your npm package manager" },
            { id: 'docker', label: 'Docker', value: 'I use Docker' },
            { id: 'maven', label: 'Maven', value: 'I use Maven' },
            { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
          ];
        } else if (/circle|circleci/i.test(messageContent)) {
          response = `Circle CI is a great choice! For your ${repositoryName || 'repository'}, you'll need to update your config.yml file. Which package managers do you use?`;
          newOptions = [
            { id: 'npm', label: 'npm', value: 'I use npm' },
            { id: 'docker', label: 'Docker', value: 'I use Docker' },
            { id: 'maven', label: 'Maven', value: 'I use Maven' },
            { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
          ];
        } else if (/jenkins/i.test(messageContent)) {
          response = `Jenkins is a powerful CI server. For your ${repositoryName || 'repository'}, you'll need to update your Jenkinsfile. Which package managers do you use?`;
          newOptions = [
            { id: 'npm', label: 'npm', value: 'I use npm' },
            { id: 'docker', label: 'Docker', value: 'I use Docker' },
            { id: 'maven', label: 'Maven', value: 'I use Maven' },
            { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
          ];
        } else if (/docker|container/i.test(messageContent)) {
          response = `I'll add Docker configuration to your setup. Here's what you'll need:
          
\`\`\`yaml
# Add this to your GitHub Actions workflow
- name: Login to JFrog Docker Registry
  uses: docker/login-action@v2
  with:
    registry: \${{ secrets.JFROG_DOCKER_REGISTRY }}
    username: \${{ secrets.JFROG_USERNAME }}
    password: \${{ secrets.JFROG_PASSWORD }}

- name: Build and push Docker image
  uses: docker/build-push-action@v4
  with:
    context: .
    push: true
    tags: \${{ secrets.JFROG_DOCKER_REGISTRY }}/my-docker-image:latest
\`\`\`

Let me know if you need a complete example workflow.`;
          newOptions = [
            { id: 'npm', label: 'Add npm configuration', value: 'I also want to configure npm' },
            { id: 'complete', label: 'Show complete example', value: 'Show me a complete example' }
          ];
        } else if (/complete|done|finished|full|example/i.test(messageContent)) {
          response = `Here's a complete GitHub Actions workflow for ${repositoryName || 'your repository'}:
          
\`\`\`yaml
name: Build and Publish

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      - name: Configure JFrog CLI
        uses: jfrog/setup-jfrog-cli@v3
        env:
          JF_URL: \${{ secrets.JFROG_URL }}
          JF_ACCESS_TOKEN: \${{ secrets.JFROG_ACCESS_TOKEN }}
      
      - name: Set JFrog npm repository
        run: jf npm-config --global --server-id-resolve=default --repo-resolve=npm

      - name: Install dependencies
        run: jf npm install
      
      - name: Build
        run: jf npm run build
      
      - name: Login to JFrog Docker Registry
        uses: docker/login-action@v2
        with:
          registry: \${{ secrets.JFROG_DOCKER_REGISTRY }}
          username: \${{ secrets.JFROG_USERNAME }}
          password: \${{ secrets.JFROG_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: \${{ secrets.JFROG_DOCKER_REGISTRY }}/\${repositoryName || 'my-app'}:latest
\`\`\`

This workflow handles both npm and Docker configurations with JFrog. You'll need to set up the following secrets in your GitHub repository:
- JFROG_URL - Your JFrog platform URL
- JFROG_ACCESS_TOKEN - Your JFrog access token
- JFROG_DOCKER_REGISTRY - Your JFrog Docker registry URL
- JFROG_USERNAME and JFROG_PASSWORD - For Docker registry login`;
          newOptions = [
            { id: 'done', label: 'Thanks, that\'s all!', value: 'Thanks, that\'s all I needed!' }
          ];
        } else if (/npm|node|javascript|typescript/i.test(messageContent)) {
          // Create enhanced response with diff visualization
          const originalWorkflow = generateNpmWebAppSnippet();
          const modifiedWorkflow = generateNpmWebAppWithJFrogSnippet();

          // Create diff by comparing original and modified workflows
          const original = originalWorkflow.split('\n');
          const modified = modifiedWorkflow.split('\n');

          // Find the line index where JFrog setup is added
          const jfrogStartIndex = modified.findIndex(line => line.includes('Setup JFrog'));
          let jfrogEndIndex = jfrogStartIndex;

          // Find the end of the JFrog block (4 lines: name, uses, with, subdomain)
          if (jfrogStartIndex !== -1) {
            for (let i = jfrogStartIndex + 1; i < modified.length; i++) {
              if (modified[i].trim() === '') break;
              jfrogEndIndex = i;
            }
          }

          // Create the diff output
          let diffOutput = '';

          modified.forEach((line, index) => {
            // If this is part of the JFrog setup block, prefix with +
            if (index >= jfrogStartIndex && index <= jfrogEndIndex) {
              diffOutput += `+ ${line}\n`;
            } else {
              diffOutput += `  ${line}\n`;
            }
          });

          // Use setTimeout to ensure loading indicator shows
          const npmResponse = `I'll add npm configuration to your setup. Here's what your workflow file will look like:

\`\`\`diff
${diffOutput}
\`\`\`

The green lines show the JFrog configuration that you need to add to your workflow file.

You can see a more detailed diff visualization in the CI Configuration section.`;

          const npmOptions = [
            { id: 'view_diff', label: 'View Repositories', value: 'I want to see the Repositories' },
            { id: 'docker', label: 'Add Docker', value: 'I also use Docker' },
            { id: 'done', label: 'No, I\'m done', value: 'No, that\'s all I need' }
          ];

          // Add a separate delay for npm handling within the general case
          setTimeout(() => {
            const botResponse: Message = {
              id: Date.now().toString(),
              role: 'bot',
              content: npmResponse
            };

            setMessages(prev => [...prev, botResponse]);
            setOptions(npmOptions);
            setIsProcessing(false);
          }, 8000);

          // Skip the rest of the processing
          return;
        } else {
          response = `I understand you're asking about "${messageContent}". To configure JFrog with your CI workflow, I need to know which CI server you're using and which package managers your project uses. Could you provide more details?`;
          newOptions = [
            { id: 'npm', label: 'GitHub Actions', value: "Great! Let's configure your npm package manager while scanning your Git repository structure and validating your workflow configuration" },
            { id: 'docker', label: 'Docker', value: 'I use Docker' },
            { id: 'maven', label: 'Jenkins', value: 'I use Jenkins with Maven' }
          ];
        }

        // Add bot response
        if (response) {
          const botResponse: Message = {
            id: Date.now().toString(),
            role: 'bot',
            content: response
          };

          setMessages(prev => [...prev, botResponse]);
        }

        // Update options if needed
        if (newOptions.length > 0) {
          setOptions(newOptions);
        }

        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing message:', error);

        const botResponse: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: 'Sorry, I encountered an error while processing your request. Please try again.'
        };

        setMessages(prev => [...prev, botResponse]);
        setIsProcessing(false);
      }
    }, delay);
  };

  return {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
  };
};

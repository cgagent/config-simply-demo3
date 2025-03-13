
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message, ChatOption } from '../types';

export const useConfigChat = (repositoryName?: string) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `Hi! I'm your FlyFrog CI configuration assistant. I can help you set up CI integration for ${repositoryName || 'your repository'}. What CI server are you using?`
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ChatOption[]>([
    { id: 'github', label: 'GitHub Actions', value: 'I use GitHub Actions' },
    { id: 'circleci', label: 'Circle CI', value: 'I use Circle CI' },
    { id: 'jenkins', label: 'Jenkins', value: 'I use Jenkins' },
    { id: 'gitlab', label: 'GitLab CI', value: 'I use GitLab CI' },
    { id: 'azure', label: 'Azure DevOps', value: 'I use Azure DevOps' }
  ]);
  const { toast } = useToast();

  const handleSelectOption = (option: ChatOption) => {
    // Use the selected option as the user's message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option.value
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Process the selected option
    processMessage(option.value);
  };

  const handleSendMessage = async () => {
    // This function is kept for compatibility but no longer uses input
    setIsProcessing(true);
    // You could add a default message here if needed
  };

  const processMessage = (content: string) => {
    // Simulate AI processing
    setTimeout(() => {
      let response = '';
      let newOptions: ChatOption[] = [];
      
      // Very simple rule-based responses for demo purposes
      if (/github|actions/i.test(content)) {
        response = `Great! GitHub Actions is a popular choice. For your ${repositoryName || 'repository'}, you'll need to add the FlyFrog configuration to your workflow file. Which package managers do you use?`;
        newOptions = [
          { id: 'npm', label: 'npm / Node.js', value: 'I use npm and Node.js' },
          { id: 'docker', label: 'Docker', value: 'I use Docker' },
          { id: 'maven', label: 'Maven / Java', value: 'I use Maven for Java' },
          { id: 'python', label: 'Python / pip', value: 'I use Python with pip' },
          { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
        ];
      } else if (/circle|circleci/i.test(content)) {
        response = `Circle CI is a great choice! For your ${repositoryName || 'repository'}, you'll need to update your config.yml file. Which package managers do you use?`;
        newOptions = [
          { id: 'npm', label: 'npm / Node.js', value: 'I use npm and Node.js' },
          { id: 'docker', label: 'Docker', value: 'I use Docker' },
          { id: 'maven', label: 'Maven / Java', value: 'I use Maven for Java' },
          { id: 'python', label: 'Python / pip', value: 'I use Python with pip' },
          { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
        ];
      } else if (/jenkins/i.test(content)) {
        response = `Jenkins is a powerful CI server. For your ${repositoryName || 'repository'}, you'll need to update your Jenkinsfile. Which package managers do you use?`;
        newOptions = [
          { id: 'npm', label: 'npm / Node.js', value: 'I use npm and Node.js' },
          { id: 'docker', label: 'Docker', value: 'I use Docker' },
          { id: 'maven', label: 'Maven / Java', value: 'I use Maven for Java' },
          { id: 'python', label: 'Python / pip', value: 'I use Python with pip' },
          { id: 'multiple', label: 'Multiple package managers', value: 'I use multiple package managers' }
        ];
      } else if (/npm|node|javascript|typescript/i.test(content)) {
        response = `I'll add npm configuration to your setup. Here's a snippet you can add to your workflow file:
        
\`\`\`yaml
- name: Setup FlyFrog
  uses: jfrog/setup-flyfrog@v1
  with:
    subdomain: acme

- name: Install npm dependencies
  run: npm install
\`\`\`

Would you like to add any other package managers?`;
        newOptions = [
          { id: 'docker', label: 'Add Docker', value: 'I also use Docker' },
          { id: 'done', label: 'No, I\'m done', value: 'No, that\'s all I need' },
          { id: 'complete', label: 'Show complete example', value: 'Show me a complete example' }
        ];
      } else if (/docker|container/i.test(content)) {
        response = `I'll add Docker configuration to your setup. Here's what you'll need:
        
\`\`\`yaml
- name: Setup FlyFrog
  uses: jfrog/setup-flyfrog@v1
  with:
    subdomain: acme

- name: Build Docker image
  run: docker build -t ${repositoryName || 'your-image'}:latest .
\`\`\`

Is there anything else you need help with?`;
        newOptions = [
          { id: 'npm', label: 'Add npm/Node.js', value: 'I also use npm and Node.js' },
          { id: 'done', label: 'No, I\'m done', value: 'No, that\'s all I need' },
          { id: 'complete', label: 'Show complete example', value: 'Show me a complete example' }
        ];
      } else if (/complete|done|finished|full|example/i.test(content)) {
        response = `Here's a complete GitHub Actions workflow for ${repositoryName || 'your repository'}:
        
\`\`\`yaml
name: CI Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup FlyFrog
        uses: jfrog/setup-flyfrog@v1
        with:
          subdomain: acme
          
      - name: Install npm dependencies
        run: npm install
        
      # Other npm build steps
\`\`\`

Once you add this file to your repository and merge it to your main branch, FlyFrog will be connected with your workflow.`;
        newOptions = [
          { id: 'thanks', label: 'Thanks!', value: 'Thanks, this is exactly what I needed!' },
          { id: 'question', label: 'I have a question', value: 'I have a question about this configuration' }
        ];
      } else {
        response = `I understand you're asking about "${content}". To configure FlyFrog with your CI workflow, I need to know which CI server you're using and which package managers your project uses. Could you provide more details?`;
        newOptions = [
          { id: 'github', label: 'GitHub Actions', value: 'I use GitHub Actions' },
          { id: 'circleci', label: 'Circle CI', value: 'I use Circle CI' },
          { id: 'jenkins', label: 'Jenkins', value: 'I use Jenkins' },
          { id: 'gitlab', label: 'GitLab CI', value: 'I use GitLab CI' },
          { id: 'azure', label: 'Azure DevOps', value: 'I use Azure DevOps' }
        ];
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response
      };
      
      setMessages(prev => [...prev, botMessage]);
      setOptions(newOptions);
      setIsProcessing(false);
    }, 1500);
  };

  return {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
  };
};

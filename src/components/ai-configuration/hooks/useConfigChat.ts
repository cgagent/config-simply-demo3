
import { useState, useCallback } from 'react';
import { Message, ChatOption } from '../types';

export const useConfigChat = (
  repositoryName?: string, 
  navigate?: (path: string) => void,
  onMergeSuccess?: (repoName: string, packageType: string) => void
) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `Hi there! I'm your JFrog configuration assistant. How can I help you with ${repositoryName || 'your repository'} setup today?`
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ChatOption[]>([
    { id: 'ci-setup', label: 'Set up CI integration', value: 'ci-setup' },
    { id: 'package-config', label: 'Configure package managers', value: 'package-config' },
    { id: 'security-scan', label: 'Set up security scanning', value: 'security-scan' }
  ]);
  
  // Add user message
  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content }
    ]);
  }, []);

  // Add bot message
  const addBotMessage = useCallback((content: React.ReactNode) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'bot', content }
    ]);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addUserMessage(content);
    
    // Clear options when user sends a message
    setOptions([]);
    
    // Simulate processing
    setIsProcessing(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Handle repository configuration response
      if (content.toLowerCase().includes('repository') || content.toLowerCase().includes('repo')) {
        addBotMessage(`I'll help you configure the repository${repositoryName ? ` "${repositoryName}"` : ''}. What would you like to do?`);
        setOptions([
          { id: 'ci-setup', label: 'Set up CI integration', value: 'ci-setup' },
          { id: 'package-config', label: 'Configure package managers', value: 'package-config' }
        ]);
      } 
      // Handle CI integration response
      else if (content.toLowerCase().includes('ci') || content.toLowerCase().includes('integration')) {
        addBotMessage('I can help you set up CI integration. Do you want to configure GitHub Actions or another CI system?');
        setOptions([
          { id: 'github', label: 'GitHub Actions', value: 'github' },
          { id: 'other', label: 'Other CI', value: 'other' }
        ]);
      }
      // Generic response for other messages
      else {
        addBotMessage('I understand you need assistance. Here are some options to help you:');
        setOptions([
          { id: 'ci-setup', label: 'Set up CI integration', value: 'ci-setup' },
          { id: 'package-config', label: 'Configure package managers', value: 'package-config' },
          { id: 'security-scan', label: 'Set up security scanning', value: 'security-scan' }
        ]);
      }
      
      setIsProcessing(false);
    }, 1000);
  }, [repositoryName, addUserMessage, addBotMessage]);

  // Handle option selection
  const handleSelectOption = useCallback((option: ChatOption) => {
    // Clear current options
    setOptions([]);
    
    // Add user selection as message
    addUserMessage(option.label);
    
    // Process the selected option
    setIsProcessing(true);
    
    setTimeout(() => {
      if (option.value === 'ci-setup') {
        addBotMessage('Great! To set up CI integration, we need to know which CI system you\'re using:');
        setOptions([
          { id: 'github', label: 'GitHub Actions', value: 'github' },
          { id: 'other', label: 'Other CI System', value: 'other' }
        ]);
      } 
      else if (option.value === 'github') {
        addBotMessage('You selected GitHub Actions. Here\'s how to set up JFrog integration with GitHub Actions...');
        
        // Example of options for next steps
        setOptions([
          { id: 'show-example', label: 'Show example workflow', value: 'show-example' },
          { id: 'complete-setup', label: 'Complete setup', value: 'complete-setup' }
        ]);
      }
      else if (option.value === 'other') {
        addBotMessage('You selected Other CI System. Here\'s how to set up JFrog integration with other CI systems...');
        
        // Example of options for next steps
        setOptions([
          { id: 'show-example', label: 'Show example script', value: 'show-example' },
          { id: 'complete-setup', label: 'Complete setup', value: 'complete-setup' }
        ]);
      }
      else if (option.value === 'complete-setup') {
        // Simulate a successful configuration
        addBotMessage('I\'ve prepared the configuration for you. Would you like to apply it now?');
        
        setOptions([
          { id: 'apply', label: 'Yes, apply now', value: 'apply' },
          { id: 'later', label: 'I\'ll do it later', value: 'later' }
        ]);
      }
      else if (option.value === 'apply') {
        addBotMessage('Great! The configuration has been applied successfully.');
        
        // Call the onMergeSuccess callback if provided
        if (onMergeSuccess && repositoryName) {
          onMergeSuccess(repositoryName, 'npm'); // Example package type
        }
      }
      else {
        // Generic response for other options
        addBotMessage(`You selected: ${option.label}. How would you like to proceed?`);
        setOptions([
          { id: 'continue', label: 'Continue setup', value: 'continue' },
          { id: 'help', label: 'I need more help', value: 'help' }
        ]);
      }
      
      setIsProcessing(false);
    }, 1000);
  }, [addUserMessage, addBotMessage, onMergeSuccess, repositoryName]);

  return {
    messages,
    isProcessing,
    handleSendMessage,
    options,
    handleSelectOption,
    addUserMessage,
    addBotMessage
  };
};

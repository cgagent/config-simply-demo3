
import { useRef, useEffect } from 'react';
import { useMessageManagement } from './useMessageManagement';
import { usePackageSelection } from './usePackageSelection';
import { useCISelection } from './useCISelection';
import { useCodeSnippets } from './useCodeSnippets';
import { Message } from '@/components/ai-chat/constants';

export const useCISetupChat = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    setMessages,
    isProcessing,
    setIsProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
  } = useMessageManagement();

  const {
    selectedCI,
    shouldShowCIOptions,
    handleCIOption,
  } = useCISelection(messages, isProcessing);

  const {
    selectedPackages,
    showPackageOptions,
    setShowPackageOptions,
    handlePackageSelection,
    handleContinueWithPackages,
  } = usePackageSelection(messages, isProcessing);

  const {
    showCodeSnippets,
    setShowCodeSnippets,
    copyToClipboard,
    generateSnippet,
    generateFullWorkflow,
  } = useCodeSnippets(selectedCI);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle CI selection with message updates
  const handleCIOptionWithMessages = (option: string) => {
    const result = handleCIOption(option);
    
    setMessages(prev => [...prev, result.userMessage]);
    setIsProcessing(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: result.botMessageContent
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowPackageOptions(true);
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Handle package selection with message updates
  const handleContinueWithPackagesAndMessages = () => {
    if (!handleContinueWithPackages()) return;

    // Add user selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Selected packages: ${selectedPackages.join(', ')}`
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setShowPackageOptions(false);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Great! I'll help you configure JFrog with ${selectedPackages.join(', ')}. Here are the code snippets you need to add to your CI workflow:`
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowCodeSnippets(true);
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Adapt function signatures to match the original hook
  const adaptedGenerateSnippet = () => generateSnippet(selectedPackages);
  const adaptedGenerateFullWorkflow = () => generateFullWorkflow(selectedPackages);

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    selectedPackages,
    showPackageOptions,
    showCodeSnippets,
    selectedCI,
    messagesEndRef,
    handleCIOption: handleCIOptionWithMessages,
    handlePackageSelection,
    handleContinueWithPackages: handleContinueWithPackagesAndMessages,
    copyToClipboard,
    generateSnippet: adaptedGenerateSnippet,
    generateFullWorkflow: adaptedGenerateFullWorkflow,
    handleSendMessage,
    shouldShowCIOptions
  };
};

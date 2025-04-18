import { useToast } from '@/hooks/use-toast';
import { useMessageState } from './useMessageState';
import { ChatOption } from '@/components/ai-configuration/types';
import { generateSecurityRemediationResponse } from '../config/responses/securityResponses';
import { isCIConfigurationQuery, getSampleRepository, Repository } from '../config/patterns/ciPatterns';
import { checkSpecialQuery } from '../config/patterns/specialQueriesPatterns';
import { getRandomResponse } from '../utils/aiResponseUtils';
import { useState } from 'react';

export const useMessageHandler = () => {
  const { toast } = useToast();
  const [showCIConfig, setShowCIConfig] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  
  const {
    messages,
    isProcessing,
    setIsProcessing,
    inputValue,
    setInputValue,
    addUserMessage,
    addBotMessage,
    resetMessages
  } = useMessageState();

  const handleSecurityRemediation = (option: ChatOption) => {
    // Add user's selection as a message
    addUserMessage(option.value);
    setIsProcessing(true);

    // Handle the remediation action using predefined responses
    setTimeout(() => {
      const response = generateSecurityRemediationResponse(option.id);
      addBotMessage(response);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addUserMessage(content);
    setIsProcessing(true);
    
    try {
      // Enhanced logging for debugging
      console.log("Original content:", content);
      
      // First, check if this is a CI configuration request
      if (isCIConfigurationQuery(content)) {
        // Set repository data
        setRepository(getSampleRepository());
        setShowCIConfig(true);
        
        // Add a 2.5-second delay for CI configuration response
        setTimeout(() => {
          addBotMessage("Great, let's set up your CI to work with JFrog. Which CI tools are you using?");
          setIsProcessing(false);
        }, 2500); // 2.5 seconds delay for "thinking"
        return;
      }
      
      // Next, check if this is a special query
      const specialQueryType = checkSpecialQuery(content);
      if (specialQueryType === 'blockedPackages') {
        console.log("Blocked packages query detected");
        
        const blockResponse = `In the past 2 weeks, we blocked the following malicious npm packages:

evil-package-101: Attempted to steal user credentials.
malware-lib: Contained scripts to inject ransomware.
bad-actor-addon: Had a payload to exfiltrate private data.`;
        
        addBotMessage(blockResponse);
        setIsProcessing(false);
        return;
      }
      
      // Handle other queries with a slight delay to simulate processing
      setTimeout(() => {
        try {
          const aiResponse = getRandomResponse(content);
          console.log("AI response:", aiResponse);
          addBotMessage(aiResponse);
        } catch (error) {
          console.error("Error generating AI response:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to generate response. Please try again."
          });
        } finally {
          setIsProcessing(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again."
      });
      setIsProcessing(false);
    }
  };

  const handleSelectQuery = (query: string) => {
    setInputValue(query);
  };

  const fullReset = () => {
    resetMessages();
    setShowCIConfig(false);
    setRepository(null);
  };

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    handleSecurityRemediation,
    fullReset,
    showCIConfig,
    repository
  };
};

import { useToast } from '@/hooks/use-toast';
import { useCIConfiguration } from './useCIConfiguration';
import { useSpecialQueries } from './useSpecialQueries';
import { useMessageState } from './useMessageState';

export const useMessageHandler = () => {
  const { toast } = useToast();
  
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
  
  const {
    showCIConfig,
    repository,
    handleCIConfiguration,
    resetCIConfiguration
  } = useCIConfiguration();
  
  const { processSpecialQuery } = useSpecialQueries();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addUserMessage(content);
    setIsProcessing(true);
    
    try {
      // Enhanced logging for debugging
      console.log("Original content:", content);
      
      // First, check if this is a CI configuration request
      const ciResult = handleCIConfiguration(content);
      if (ciResult.handled) {
        // Add a 2.5-second delay for CI configuration response
        setTimeout(() => {
          addBotMessage(ciResult.response);
          setIsProcessing(false);
        }, 2500); // 2.5 seconds delay for "thinking"
        return;
      }
      
      // Next, check if this is a special query
      const specialQueryResult = processSpecialQuery(content);
      if (specialQueryResult.handled) {
        addBotMessage(specialQueryResult.response);
        setIsProcessing(false);
        return;
      }
      
      // Handle other queries with a slight delay to simulate processing
      setTimeout(() => {
        try {
          const aiResponse = specialQueryResult.getResponse();
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
    // Modified: Instead of sending the message directly, just set it in the input field
    setInputValue(query);
    // Removed automatic message sending
  };

  const fullReset = () => {
    resetMessages();
    resetCIConfiguration();
  };

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    showCIConfig,
    repository,
    resetMessages: fullReset // Use the combined reset function
  };
};

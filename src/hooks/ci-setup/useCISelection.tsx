
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/components/ai-chat/constants';

export const useCISelection = (messages: Message[], isProcessing: boolean) => {
  const [selectedCI, setSelectedCI] = useState<'github' | 'other' | null>(null);
  const { toast } = useToast();

  const handleCIOption = (option: string) => {
    // Save the selected CI option
    setSelectedCI(option.toLowerCase().includes('github') ? 'github' : 'other');
    
    // Add user selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option
    };
    
    // Return the message to be added in the main hook
    return { userMessage, botMessageContent: "Amazing, now lets select the package managers you would like to set up." };
  };

  // Check if the last message is the CI tools question to show options
  const shouldShowCIOptions = messages.length > 0 && 
    messages[messages.length - 1].role === 'bot' && 
    messages[messages.length - 1].content.includes("Which CI tools are you using");

  return {
    selectedCI,
    shouldShowCIOptions,
    handleCIOption
  };
};

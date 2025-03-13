
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Message } from '../constants';
import { simulateAIResponse } from '../utils/aiResponseUtils';

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showCIConfig, setShowCIConfig] = useState(false);
  const [repository, setRepository] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Enhanced logging for debugging
      console.log("Original content:", content);
      const lowerContent = content.toLowerCase().trim();
      console.log("Lowercase trimmed content:", lowerContent);
      
      // Check if this is a CI Setup query
      if (lowerContent.includes('ci') && 
          (lowerContent.includes('setup') || lowerContent.includes('assist'))) {
        
        // Add a bot response first
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "I'll help you set up CI integration. Let me bring up our CI configuration assistant:"
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Show embedded CI configuration instead of redirecting
        setRepository({
          id: 'sample-repo-1',
          name: 'sample-repository',
          owner: 'flyfrog',
          isConfigured: false,
          language: 'JavaScript'
        });
        setShowCIConfig(true);
        setIsProcessing(false);
        
      } 
      // Check for blocked packages query directly
      else if (
        lowerContent === "which packages were blocked in the last two weeks?" ||
        lowerContent === "blocked packages" ||
        lowerContent === "show me the packages that are blocked" ||
        lowerContent === "block" ||
        lowerContent.includes('block') ||
        lowerContent.includes('malicious')
      ) {
        console.log("Blocked packages query detected");
        
        const blockResponse = `In the past 2 weeks, we blocked the following malicious npm packages:

evil-package-101: Attempted to steal user credentials.
malware-lib: Contained scripts to inject ransomware.
bad-actor-addon: Had a payload to exfiltrate private data.`;
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: blockResponse
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsProcessing(false);
      }
      else {
        // Enhanced debugging
        console.log("Processing query:", content.trim());
        
        // Handle other queries with a slight delay to simulate processing
        setTimeout(() => {
          // Get the AI response with the properly formatted content
          const cleanedContent = content.trim();
          console.log("Cleaned content:", cleanedContent);
          
          const aiResponse = simulateAIResponse(cleanedContent);
          console.log("AI Response:", aiResponse);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: aiResponse
          };
          
          setMessages(prev => [...prev, botResponse]);
          setIsProcessing(false);
        }, 1000); // Reduced from 1500ms to 1000ms for faster response
      }
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
    // Automatically send the message when a suggested query is selected
    handleSendMessage(query);
  };

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    showCIConfig,
    repository
  };
};


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
      // Check if this is a CI Setup query
      if (content.toLowerCase().includes('ci') && 
          (content.toLowerCase().includes('setup') || content.toLowerCase().includes('assist'))) {
        
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
        
      } else {
        // Handle other queries as before
        setTimeout(() => {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: simulateAIResponse(content)
          };
          
          setMessages(prev => [...prev, botResponse]);
          setIsProcessing(false);
        }, 1500);
      }
    } catch (error) {
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

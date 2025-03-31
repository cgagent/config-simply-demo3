
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/components/ai-chat/constants';
import { simulateAIResponse } from '@/components/ai-chat/utils/aiResponseUtils';

export const useMessageManagement = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  // Initialize with the first message
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial-message',
      role: 'user',
      content: 'I would like to set up my CI to work with JFrog. Can you set it up for me?'
    };
    
    setMessages([initialMessage]);
    
    // Simulate the bot response after a short delay
    setIsProcessing(true);
    setTimeout(() => {
      const botResponse: Message = {
        id: 'bot-response-1',
        role: 'bot',
        content: "Great, lets set up your CI to work with JFrog.\nWhich CI tools are you using:"
      };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, 1000);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const aiResponse = simulateAIResponse(content);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: aiResponse
        };
        
        setMessages(prev => [...prev, botMessage]);
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
    }, 1500);
  };

  return {
    messages,
    setMessages,
    isProcessing,
    setIsProcessing,
    inputValue,
    setInputValue,
    handleSendMessage
  };
};

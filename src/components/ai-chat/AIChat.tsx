
import React, { useState } from 'react';
import { Message } from './ChatMessage';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SuggestedQueries } from './SuggestedQueries';
import { useToast } from '@/hooks/use-toast';

// Sample queries that will be inserted when clicking the suggestion bubbles
const SUGGESTED_QUERIES = [
  {
    label: "CI Setup",
    query: "I would like to set up my CI to work with you, can you please assist me to do it."
  },
  {
    label: "Org packages",
    query: "What are the packages that are being used in the last month? Please order it based on consumption date and show me the package type, latest version and vulnerability status."
  },
  {
    label: "Sbom",
    query: "Please create an Sbom report for me for the packages that are being used in the last 30 days in my organization."
  },
  {
    label: "Public package",
    query: "I would like to use axios, can you please share with me more details: what package should I use, any vulnerabilities I should know, what are the latest versions, and is there any reason why I should not use it?"
  },
  {
    label: "Blocked packages",
    query: "Can you please share with me the blocked packages that did not enter my organization in the last 2 weeks? Include package name, package type, and why it was blocked."
  }
];

const INITIAL_MESSAGES: Message[] = [];

// Custom FlyFrog Icon component
const FlyFrogIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    {/* Frog body */}
    <circle cx="12" cy="12" r="8" fill="#9b87f5" stroke="none" />
    
    {/* Frog features */}
    <circle cx="9" cy="9" r="1.5" fill="white" stroke="none" /> {/* Left eye */}
    <circle cx="15" cy="9" r="1.5" fill="white" stroke="none" /> {/* Right eye */}
    <circle cx="9" cy="9" r="0.7" fill="black" stroke="none" /> {/* Left pupil */}
    <circle cx="15" cy="9" r="0.7" fill="black" stroke="none" /> {/* Right pupil */}
    
    {/* Mouth */}
    <path d="M9 13a3 2 0 0 0 6 0" stroke="#6E59A5" strokeWidth="1" />
    
    {/* Wings */}
    <path d="M4 8c0 0 2,-4 6,-3" stroke="#F97316" fill="#FEC6A1" strokeWidth="1" />
    <path d="M20 8c0 0 -2,-4 -6,-3" stroke="#F97316" fill="#FEC6A1" strokeWidth="1" />
    
    {/* Tiny front legs */}
    <line x1="10" y1="16" x2="9" y2="18" stroke="#6E59A5" strokeWidth="1.5" />
    <line x1="14" y1="16" x2="15" y2="18" stroke="#6E59A5" strokeWidth="1.5" />
  </svg>
);

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

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
      // Simulate AI processing
      // In a real app, this would be an API call to an LLM service
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: simulateAIResponse(content)
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsProcessing(false);
      }, 1500);
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

  // Simulate AI response (would be replaced with actual API call)
  const simulateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! How can I assist you today?";
    } 
    else if (lowerQuery.includes('repository') || lowerQuery.includes('repositories')) {
      return "Repositories are where your code lives. You can manage your repositories through the CI section of this application. Would you like to know more about setting up CI for your repositories?";
    }
    else if (lowerQuery.includes('ci') || lowerQuery.includes('continuous integration')) {
      return "Continuous Integration (CI) helps you automatically build, test, and validate code changes. Our CI tools integrate with your repositories to ensure code quality and streamline deployments. You can set up CI workflows in the CI section.";
    }
    else if (lowerQuery.includes('user') || lowerQuery.includes('account')) {
      return "User management allows you to control access to your organization's resources. You can add users, define roles, and set permissions in the User Management section.";
    }
    else {
      return "I understand you're asking about \"" + query + "\". Let me provide some information about that. This is a simulated response in our demo application. In a production environment, this would connect to an AI language model API like OpenAI GPT, Anthropic Claude, or Perplexity to provide helpful and accurate responses.";
    }
  };

  // Initial state (no messages yet)
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-2">
        <div className="flex items-center justify-center mb-2">
          <div className="relative h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FlyFrogIcon />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">What do you want to know?</h1>
        <div className="w-full max-w-xl">
          <ChatInput 
            isProcessing={isProcessing} 
            onSendMessage={handleSendMessage}
            isInitialState={true}
            value={inputValue}
            setValue={setInputValue}
          />
          <div className="mt-4">
            <SuggestedQueries 
              queries={SUGGESTED_QUERIES.map(q => q.label)} 
              onSelectQuery={(label) => {
                const query = SUGGESTED_QUERIES.find(q => q.label === label)?.query || '';
                handleSelectQuery(query);
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Chat state (after user has sent at least one message)
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} />
      </div>
      <div className="pt-4 border-t">
        <ChatInput 
          isProcessing={isProcessing} 
          onSendMessage={handleSendMessage} 
          isInitialState={false}
          value={inputValue}
          setValue={setInputValue}
        />
      </div>
    </div>
  );
};

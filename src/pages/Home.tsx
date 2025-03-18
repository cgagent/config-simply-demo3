
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import StatisticsBar from '@/components/StatisticsBar';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const initialRender = useRef(true);
  const chatQueryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sample data for statistics - in a real app, this would come from an API or state
  const statsData = {
    ciCompletionPercentage: 78,
    blockedPackages: 3,
    totalPackages: 12486,
    dataConsumption: 1528
  };

  // Reset chat when navigating to home
  useEffect(() => {
    // Skip the initial render to avoid resetting on first load
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Reset chat whenever location state has resetChat flag
    if (location.pathname === '/home' && location.state && location.state.resetChat) {
      console.log("Resetting chat state from location state change");
      setIsChatActive(false);
      setChatInputValue('');
      setShouldSendMessage(false);
      // Clear the state to avoid repeating this action
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handler for statistics panel queries
  const handleChatQuery = useCallback((query: string) => {
    console.log("Chat query initiated:", query);
    
    // Clear any existing timeout
    if (chatQueryTimeoutRef.current) {
      clearTimeout(chatQueryTimeoutRef.current);
    }
    
    // Activate chat
    setIsChatActive(true);
    
    // Reset any existing state
    setShouldSendMessage(false);
    setChatInputValue('');
    
    // Sequential operations with timeouts to ensure proper state updates
    chatQueryTimeoutRef.current = setTimeout(() => {
      // First set the input value
      setChatInputValue(query);
      
      // Then trigger the send after a short delay
      chatQueryTimeoutRef.current = setTimeout(() => {
        setShouldSendMessage(true);
      }, 150);
    }, 150);
    
  }, []);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (chatQueryTimeoutRef.current) {
        clearTimeout(chatQueryTimeoutRef.current);
      }
    };
  }, []);

  // Clear the shouldSendMessage flag after the message has been sent
  const clearShouldSendMessage = useCallback(() => {
    setShouldSendMessage(false);
  }, []);

  // Clear the initial input value after it has been processed
  const clearInitialInputValue = useCallback(() => {
    setChatInputValue('');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <main className="flex-1 w-full mx-auto flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-64px)] pt-6">
          {!isChatActive && (
            <StatisticsBar 
              ciCompletionPercentage={statsData.ciCompletionPercentage}
              blockedPackages={statsData.blockedPackages}
              totalPackages={statsData.totalPackages}
              dataConsumption={statsData.dataConsumption}
              onChatQuery={handleChatQuery}
            />
          )}
          
          <div className="flex-1 flex flex-col border-0 overflow-hidden bg-background dark:bg-background">
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <AIChat 
                onChatStateChange={setIsChatActive}
                initialInputValue={chatInputValue}
                clearInitialInputValue={clearInitialInputValue}
                shouldSendMessage={shouldSendMessage}
                clearShouldSendMessage={clearShouldSendMessage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

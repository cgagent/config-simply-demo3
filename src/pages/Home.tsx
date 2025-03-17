
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import StatisticsBar from '@/components/StatisticsBar';
import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const location = useLocation();
  const initialRender = useRef(true);
  const queryCooldownRef = useRef(false);
  const lastQueryRef = useRef('');
  
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

  // Handler for statistics panel queries with debounce
  const handleChatQuery = useCallback((query: string) => {
    // Prevent rapid sequential clicks and reprocessing the same query
    if (queryCooldownRef.current || query === lastQueryRef.current) return;
    
    // Set cooldown flag and store current query
    queryCooldownRef.current = true;
    lastQueryRef.current = query;
    
    console.log("Chat query received:", query);
    
    // First completely clear the previous value
    setChatInputValue('');
    
    // Immediately activate the chat to skip the initial screen
    setIsChatActive(true);
    
    // Wait to ensure the clear has processed before setting new value
    setTimeout(() => {
      setChatInputValue(query);
      // Set flag to send the message automatically
      setShouldSendMessage(true);
      
      // Release cooldown after a sufficient delay
      setTimeout(() => {
        queryCooldownRef.current = false;
      }, 2000); // Extended to 2 seconds to prevent quick repeated clicks
    }, 150);
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
                clearInitialInputValue={() => setChatInputValue('')}
                shouldSendMessage={shouldSendMessage}
                clearShouldSendMessage={() => setShouldSendMessage(false)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

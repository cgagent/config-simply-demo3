
import React, { useState, useEffect } from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import StatisticsBar from '@/components/StatisticsBar';
import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const location = useLocation();
  
  // Sample data for statistics - in a real app, this would come from an API or state
  const statsData = {
    ciCompletionPercentage: 78,
    blockedPackages: 3,
    totalPackages: 12486,
    dataConsumption: 1528
  };

  // Reset chat when navigating to home
  useEffect(() => {
    // Reset chat whenever location changes to home or when there's an explicit reset request
    if (location.pathname === '/home') {
      setIsChatActive(false);
      setChatInputValue('');
      
      // Also handle explicit reset from navigation state
      if (location.state && location.state.resetChat) {
        // Clear the state to avoid repeating this action
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.pathname, location.state]);

  // Handler for statistics panel queries
  const handleChatQuery = (query: string) => {
    setChatInputValue(query);
    setIsChatActive(true);
  };

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
                key={isChatActive ? "active-chat" : "initial-chat"}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

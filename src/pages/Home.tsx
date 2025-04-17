import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import StatisticsBar from '@/components/StatisticsBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRepositories } from '@/contexts/RepositoryContext';
import { usePackageLocalStorage } from '@/hooks/usePackageLocalStorage';

const Home: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialRender = useRef(true);
  const chatQueryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { repositories } = useRepositories();
  const { packageStats } = usePackageLocalStorage();
  
  // Calculate CI completion numbers in the same way as StatusSummary
  const totalRepos = repositories.length;
  const configuredRepos = repositories.filter(repo => repo.isConfigured).length;
  const ciCompletionPercentage = totalRepos > 0 ? Math.round((configuredRepos / totalRepos) * 100) : 0;

  // Use package statistics from local storage
  const statsData = {
    ciCompletionPercentage,
    totalPackages: packageStats.totalPackages,
    blockedPackages: packageStats.blockedPackages,
    dataConsumption: packageStats.dataConsumption
  };

  // Reset chat when navigating to home
  useEffect(() => {
    // Skip the initial render to avoid resetting on first load
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Reset chat whenever location state has resetChat flag or when navigating to home
    if (location.pathname === '/home') {
      console.log("Resetting chat state from navigation");
      setIsChatActive(false);
      setChatInputValue('');
      setShouldSendMessage(false);
      // Clear the state to avoid repeating this action
      window.history.replaceState({}, document.title);
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      setIsChatActive(false);
      setChatInputValue('');
      setShouldSendMessage(false);
    };
  }, [location.pathname]);

  const handleChatQuery = useCallback((query: string) => {
    setChatInputValue(query);
    setShouldSendMessage(true);
    setIsChatActive(true);
  }, []);

  const clearInitialInputValue = useCallback(() => {
    setChatInputValue('');
  }, []);

  const clearShouldSendMessage = useCallback(() => {
    setShouldSendMessage(false);
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

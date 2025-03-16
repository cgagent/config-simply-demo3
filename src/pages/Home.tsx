
import React from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import StatisticsBar from '@/components/StatisticsBar';

const Home: React.FC = () => {
  // Sample data for statistics - in a real app, this would come from an API or state
  const statsData = {
    ciCompletionPercentage: 78,
    blockedPackages: 3,
    totalPackages: 12486,
    dataConsumption: 1528
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <main className="flex-1 w-full mx-auto flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-64px)] pt-6">
          <StatisticsBar 
            ciCompletionPercentage={statsData.ciCompletionPercentage}
            blockedPackages={statsData.blockedPackages}
            totalPackages={statsData.totalPackages}
            dataConsumption={statsData.dataConsumption}
          />
          
          <div className="flex-1 flex flex-col border-0 overflow-hidden bg-background dark:bg-background">
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <AIChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

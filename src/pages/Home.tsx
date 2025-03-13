
import React from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 w-full mx-auto flex flex-col">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-64px)] pt-6">
          <div className="flex-1 flex flex-col border-0 overflow-hidden bg-background">
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

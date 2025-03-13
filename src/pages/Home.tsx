
import React from 'react';
import NavBar from '@/components/NavBar';
import { AIChat } from '@/components/ai-chat/AIChat';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 w-full mx-auto py-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8">What do you want to know?</h1>
          
          {/* AI Chat container */}
          <div className="flex-1 flex flex-col border rounded-xl overflow-hidden shadow-sm bg-background">
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <AIChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

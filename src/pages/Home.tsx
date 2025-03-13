
import React from 'react';
import NavBar from '@/components/NavBar';
import { AIChat } from '@/components/ai-chat/AIChat';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-3xl mx-auto flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
            What do you want to know?
          </h1>
          
          <div className="w-full bg-card/50 rounded-xl border border-border/40 shadow-lg overflow-hidden">
            <AIChat />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

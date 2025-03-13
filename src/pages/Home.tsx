
import React from 'react';
import NavBar from '@/components/NavBar';
import { AIChat } from '@/components/ai-chat/AIChat';
import { Search, LightbulbIcon, BookOpen, Code } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 w-full mx-auto py-8 flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 mb-8">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-medium">Home</span>
          </div>
          <h1 className="text-4xl font-bold">Repository Assistant</h1>
          <p className="text-muted-foreground mt-2">Ask questions about repositories, CI/CD, or any other technical topics</p>
        </div>
        
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 flex flex-col">
          {/* Features highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Ask Anything</h3>
              <p className="text-sm text-muted-foreground">
                Get instant answers to your technical questions about repositories and CI/CD.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <LightbulbIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Smart Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Receive intelligent recommendations for your CI workflows and repository setup.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Code Examples</h3>
              <p className="text-sm text-muted-foreground">
                Get code snippets and examples to help you implement best practices.
              </p>
            </div>
          </div>
          
          {/* AI Chat container */}
          <div className="flex-1 flex flex-col border rounded-xl overflow-hidden shadow-sm bg-background mb-8">
            <div className="bg-muted/30 px-6 py-4 border-b">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                <h2 className="font-semibold">AI Assistant</h2>
              </div>
            </div>
            
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

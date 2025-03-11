
import React, { useState } from 'react';
import { Package } from '@/types/package';
import { PackageSummary } from './PackageSummary';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { SuggestedQueries } from './chat/SuggestedQueries';
import { processUserQuery, getInitialMessage, DEFAULT_SUGGESTED_QUERIES } from './chat/chatUtils';
import { Message } from './chat/ChatMessage';
import { Bot } from 'lucide-react';

interface PackageAIChatProps {
  packages: Package[];
}

const PackageAIChat: React.FC<PackageAIChatProps> = ({ packages }) => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate summary metrics
  const totalPackages = packages.length;
  const totalConsumption = packages.reduce((acc, pkg) => acc + pkg.downloads, 0);
  const totalStorage = packages.reduce((acc, pkg) => acc + pkg.size, 0);
  const maliciousPackages = packages.filter(pkg => pkg.vulnerabilities > 2).length;

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const response = processUserQuery(input, packages);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSelectQuery = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="flex flex-col h-[700px] border rounded-lg overflow-hidden bg-background">
      <div className="bg-primary p-3">
        <h3 className="text-white font-medium flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Package Management Assistant
        </h3>
      </div>
      
      {/* Summary Cards at the top */}
      <div className="p-4 bg-muted/30">
        <PackageSummary 
          totalPackages={totalPackages} 
          totalConsumption={totalConsumption} 
          totalStorage={totalStorage} 
          maliciousPackages={maliciousPackages} 
        />
      </div>
      
      <MessageList messages={messages} />
      
      {/* Suggested queries */}
      {messages.length < 3 && (
        <SuggestedQueries 
          queries={DEFAULT_SUGGESTED_QUERIES} 
          onSelectQuery={handleSelectQuery} 
        />
      )}
      
      <div className="p-3 border-t bg-background">
        <ChatInput 
          isProcessing={isProcessing} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
};

export default PackageAIChat;

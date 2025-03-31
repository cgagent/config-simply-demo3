import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from '@/components/ai-chat/MessageList';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { Message } from '@/components/ai-chat/constants';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { simulateAIResponse } from '@/components/ai-chat/utils/aiResponseUtils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const CISetupChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showPackageOptions, setShowPackageOptions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with the first message
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial-message',
      role: 'user',
      content: 'I would like to set up my CI to work with JFrog. Can you set it up for me?'
    };
    
    setMessages([initialMessage]);
    
    // Simulate the bot response after a short delay
    setIsProcessing(true);
    setTimeout(() => {
      const botResponse: Message = {
        id: 'bot-response-1',
        role: 'bot',
        content: "Great, lets set up your CI to work with JFrog.\nWhich CI tools are you using:"
      };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, 1000);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCIOption = (option: string) => {
    // Add user selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: "Amazing, now lets select the package managers you would like to set up."
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowPackageOptions(true);
      } catch (error) {
        console.error("Error generating response:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate response. Please try again."
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handlePackageSelection = (packageName: string) => {
    setSelectedPackages(prev => {
      // If already selected, remove it
      if (prev.includes(packageName)) {
        return prev.filter(p => p !== packageName);
      }
      // Otherwise add it
      return [...prev, packageName];
    });
  };

  const handleContinueWithPackages = () => {
    if (selectedPackages.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one package manager.",
        variant: "destructive"
      });
      return;
    }

    // Add user selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Selected packages: ${selectedPackages.join(', ')}`
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setShowPackageOptions(false);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Great! I'll help you configure JFrog with ${selectedPackages.join(', ')}. Would you like me to generate a sample configuration for you?`
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate response. Please try again."
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      try {
        const aiResponse = simulateAIResponse(content);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: aiResponse
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate response. Please try again."
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Check if the last message is the CI tools question to show options
  const shouldShowCIOptions = messages.length > 0 && 
    messages[messages.length - 1].role === 'bot' && 
    messages[messages.length - 1].content.includes("Which CI tools are you using");

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <main className="flex-1 w-full mx-auto flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-64px)] pt-6">
          <div className="flex-1 flex flex-col border-0 overflow-hidden bg-background dark:bg-background">
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <MessageList messages={messages} isProcessing={isProcessing} />
              
              {shouldShowCIOptions && !isProcessing && (
                <div className="flex gap-2 mb-4 mt-2">
                  <Button 
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleCIOption("Github Actions")}
                  >
                    Github Actions
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleCIOption("Other CI")}
                  >
                    Other CI
                  </Button>
                </div>
              )}

              {showPackageOptions && !isProcessing && (
                <div className="mb-4 mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {["Docker", "Python", "npm", "Maven", "Go", "Nuget"].map((pkg) => (
                      <Button
                        key={pkg}
                        variant="outline"
                        className={`justify-between ${
                          selectedPackages.includes(pkg)
                            ? "border-blue-500 bg-blue-950"
                            : "bg-blue-900/20"
                        }`}
                        onClick={() => handlePackageSelection(pkg)}
                      >
                        {pkg}
                        {selectedPackages.includes(pkg) && <Check className="h-4 w-4 ml-2" />}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleContinueWithPackages}
                    disabled={selectedPackages.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                </div>
              )}
              
              <div className="pt-4">
                <ChatInput 
                  isProcessing={isProcessing} 
                  onSendMessage={handleSendMessage} 
                  isInitialState={false}
                  value={inputValue}
                  setValue={setInputValue}
                />
              </div>
            </div>
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
};

export default CISetupChat;

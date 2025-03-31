
import React from 'react';
import { MessageList } from '@/components/ai-chat/MessageList';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { useCISetupChat } from '@/hooks/ci-setup';
import CIToolSelection from '@/components/ci-setup/CIToolSelection';
import PackageSelection from '@/components/ci-setup/PackageSelection';
import CodeSnippets from '@/components/ci-setup/CodeSnippets';

const CISetupChat: React.FC = () => {
  const {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    selectedPackages,
    showPackageOptions,
    showCodeSnippets,
    selectedCI,
    messagesEndRef,
    handleCIOption,
    handlePackageSelection,
    handleContinueWithPackages,
    copyToClipboard,
    generateSnippet,
    generateFullWorkflow,
    handleSendMessage,
    shouldShowCIOptions
  } = useCISetupChat();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <main className="flex-1 w-full mx-auto flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-64px)] pt-6">
          <div className="flex-1 flex flex-col border-0 overflow-hidden bg-background dark:bg-background">
            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              <MessageList messages={messages} isProcessing={isProcessing} />
              
              {shouldShowCIOptions && !isProcessing && (
                <CIToolSelection onSelectCI={handleCIOption} />
              )}

              {showPackageOptions && !isProcessing && (
                <PackageSelection 
                  selectedPackages={selectedPackages}
                  onPackageSelection={handlePackageSelection}
                  onContinue={handleContinueWithPackages}
                />
              )}
              
              {showCodeSnippets && !isProcessing && (
                <CodeSnippets 
                  selectedCI={selectedCI}
                  selectedPackages={selectedPackages}
                  onCopyToClipboard={copyToClipboard}
                  generateSnippet={generateSnippet}
                  generateFullWorkflow={generateFullWorkflow}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
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
      </main>
    </div>
  );
};

export default CISetupChat;

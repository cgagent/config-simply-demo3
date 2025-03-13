
import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Message } from './constants';
import AIConfigurationChat from '@/components/AIConfigurationChat';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface ConversationScreenProps {
  messages: Message[];
  isProcessing: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (content: string) => void;
  showCIConfig: boolean;
  repository?: any;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
  messages,
  isProcessing,
  inputValue,
  setInputValue,
  onSendMessage,
  showCIConfig,
  repository
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} />
      </div>
      
      {showCIConfig && (
        <div className="border-t border-border pt-2 bg-card rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-semibold px-4 py-2">CI Configuration Assistant</h3>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            <AIConfigurationChat repositoryName={repository?.name || 'sample-repository'} />
          </div>
        </div>
      )}
      
      <div className="pt-4 border-t">
        <ChatInput 
          isProcessing={isProcessing} 
          onSendMessage={onSendMessage} 
          isInitialState={false}
          value={inputValue}
          setValue={setInputValue}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Message } from './config/constants/chatConstants';
import { AIConfigurationChat } from '@/components/ai-configuration';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useRepositories } from '@/contexts/RepositoryContext';
import { ChatOption as SharedChatOption } from '@/components/shared/types';

interface Repository {
  name: string;
  // Add other repository properties as needed
}

export interface ConversationScreenProps {
  messages: Message[];
  isProcessing: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (content: string) => void;
  onSelectQuery: (query: string) => void;
  onSelectOption: (option: SharedChatOption) => void;
  showCIConfig?: boolean;
  repository?: Repository | null;
  onTokenGenerated?: (token: string, name: string, expiration: string) => void;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
  messages,
  isProcessing,
  inputValue,
  setInputValue,
  onSendMessage,
  onSelectQuery,
  onSelectOption,
  showCIConfig,
  repository
}) => {
  const navigate = useNavigate();
  const { repositories } = useRepositories();

  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages} 
        isProcessing={isProcessing}
        onSelectOption={onSelectOption}
      />
      
      <div className="flex-none p-4 border-t border-border/50">
        <ChatInput
          isProcessing={isProcessing}
          onSendMessage={onSendMessage}
          value={inputValue}
          setValue={setInputValue}
        />
      </div>

      <Sheet open={showCIConfig} onOpenChange={() => navigate('/repositories')}>
        <SheetContent side="right" className="w-[600px] sm:w-[800px]">
          <AIConfigurationChat
            repositoryName={repository?.name}
            onMergeSuccess={(repoName, packageType) => {
              // Handle merge success
              console.log(`Successfully merged configuration for ${repoName} with ${packageType}`);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

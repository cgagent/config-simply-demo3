import React from 'react';
import { FlyFrogIcon } from './FlyFrogIcon';
import { ChatInput } from './ChatInput';
import { SuggestedQueries } from './SuggestedQueries';
import { SUGGESTED_QUERIES } from './constants';

interface InitialChatScreenProps {
  isProcessing: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (content: string) => void;
  onSelectQuery: (query: string) => void;
}

export const InitialChatScreen: React.FC<InitialChatScreenProps> = ({
  isProcessing,
  inputValue,
  setInputValue,
  onSendMessage,
  onSelectQuery
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-0">
      <div className="flex items-center justify-center mb-1">
        <div className="relative h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <FlyFrogIcon />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-3">What do you want to do?</h1>
      <div className="w-full max-w-xl">
        <ChatInput 
          isProcessing={isProcessing} 
          onSendMessage={onSendMessage}
          isInitialState={true}
          value={inputValue}
          setValue={setInputValue}
        />
        <div className="mt-3">
          <SuggestedQueries 
            queries={SUGGESTED_QUERIES} 
            onSelectQuery={onSelectQuery} 
          />
        </div>
      </div>
    </div>
  );
};

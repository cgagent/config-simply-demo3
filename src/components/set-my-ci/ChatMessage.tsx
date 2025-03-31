
import React from 'react';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  type: 'system' | 'button-group';
  content: string | React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ type, content }) => {
  if (type === 'button-group') {
    return <div className="py-2">{content}</div>;
  }

  return (
    <div className="flex items-start space-x-3 animate-fadeIn">
      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
        <Bot className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        <div className="whitespace-pre-line text-gray-800">
          {content}
        </div>
      </div>
    </div>
  );
};

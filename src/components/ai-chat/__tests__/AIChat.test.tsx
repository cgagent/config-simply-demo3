/**
 * AIChat Component Tests
 * 
 * This test suite verifies the functionality of the AIChat component, which is the main
 * container component for the chat interface.
 * 
 * SCOPE:
 * - Testing component rendering in different states
 * - Verifying message display and interaction
 * - Testing input handling and message sending
 * - Verifying state management and prop handling
 * - Testing integration with child components
 * 
 * BOUNDARIES:
 * - These tests should NOT test actual API integrations
 * - They should NOT test actual AI response generation
 * - They should NOT test actual network requests
 * - They should NOT test actual database operations
 * 
 * All external dependencies are mocked to focus on component behavior.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AIChat } from '../AIChat';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { useInitialInput } from '../hooks/useInitialInput';
import { useChatStateNotifier } from '../hooks/useChatStateNotifier';
import { useAutoSendMessage } from '../hooks/useAutoSendMessage';
import { useTypingAnimation } from '../hooks/useTypingAnimation';
import { ChatInput } from '../ChatInput';
import { MessageList } from '../MessageList';
import { useNavigate } from 'react-router-dom';
import { useRepositories } from '@/contexts/RepositoryContext';
import { MessageType } from '../types/messageTypes';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useLocation: vi.fn().mockReturnValue({ pathname: '/' }),
}));

// Mock RepositoryContext
vi.mock('@/contexts/RepositoryContext', () => ({
  useRepositories: vi.fn().mockReturnValue({
    repositories: [],
  }),
}));

// Mock the ChatInput component
vi.mock('../ChatInput', () => ({
  ChatInput: ({ value, setValue, onSendMessage, isProcessing, isInitialState }) => (
    <div data-testid="chat-input">
      <textarea 
        value={value} 
        onChange={(e) => setValue && setValue(e.target.value)}
        placeholder={isInitialState ? "Ask JFrog to..." : "Ask me anything..."}
        disabled={isProcessing}
        data-testid="chat-textarea"
      />
      <button 
        onClick={() => onSendMessage(value)} 
        disabled={!value.trim() || isProcessing}
        data-testid="send-button"
      >
        Send
      </button>
    </div>
  )
}));

// Mock the MessageList component
vi.mock('../MessageList', () => ({
  MessageList: ({ messages, isProcessing, onSelectOption }) => (
    <div data-testid="message-list">
      {messages.map((message) => (
        <div key={message.id} data-testid={`message-${message.id}`}>
          <div data-testid={`message-role-${message.id}`}>{message.role}</div>
          <div data-testid={`message-content-${message.id}`}>{message.content}</div>
        </div>
      ))}
      {isProcessing && <div data-testid="processing-indicator">Processing...</div>}
    </div>
  )
}));

// Mock the hooks
vi.mock('../hooks/useMessageHandler', () => ({
  useMessageHandler: vi.fn().mockReturnValue({
    messages: [],
    isProcessing: false,
    inputValue: '',
    setInputValue: vi.fn(),
    handleSendMessage: vi.fn(),
    handleSelectQuery: vi.fn(),
    handleSecurityRemediation: vi.fn(),
    handleActionSelection: vi.fn(),
    showCIConfig: false,
    repository: null,
    fullReset: vi.fn(),
  }),
}));

vi.mock('../hooks/useTypingAnimation', () => ({
  useTypingAnimation: vi.fn().mockReturnValue({
    getAnimatedMessages: () => [],
    isAnimatingResponse: false,
  }),
}));

vi.mock('../hooks/useInitialInput', () => ({
  useInitialInput: vi.fn().mockReturnValue({
    hasInitialInput: false,
  }),
}));

vi.mock('../hooks/useAutoSendMessage', () => ({
  useAutoSendMessage: vi.fn(),
}));

vi.mock('../hooks/useChatStateNotifier', () => ({
  useChatStateNotifier: vi.fn(),
}));

describe('AIChat', () => {
  it('renders InitialChatScreen when no messages and no initial input', () => {
    render(<AIChat />);
    expect(screen.getByPlaceholderText(/ask jfrog to/i)).toBeInTheDocument();
  });

  it('renders ConversationScreen when there are messages', () => {
    // Mock useMessageHandler to return some messages
    vi.mocked(useMessageHandler).mockReturnValueOnce({
      messages: [
        { id: '1', role: 'user', content: 'Hello', type: 'text' as MessageType, timestamp: Date.now() },
        { id: '2', role: 'assistant', content: 'Hi there!', type: 'text' as MessageType, timestamp: Date.now() },
      ],
      isProcessing: false,
      inputValue: '',
      setInputValue: vi.fn(),
      handleSendMessage: vi.fn(),
      handleSelectQuery: vi.fn(),
      handleSecurityRemediation: vi.fn(),
      handleActionSelection: vi.fn(),
      repository: null,
      showCIConfig: false,
      fullReset: vi.fn(),
    });

    // Mock useTypingAnimation to return the same messages
    vi.mocked(useTypingAnimation).mockReturnValueOnce({
      getAnimatedMessages: () => [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'bot', content: 'Hi there!' },
      ],
      isAnimatingResponse: false,
    });

    render(<AIChat />);
    
    // Check for message content using data-testid
    expect(screen.getByTestId('message-content-1')).toHaveTextContent('Hello');
    expect(screen.getByTestId('message-content-2')).toHaveTextContent('Hi there!');
  });

  it('handles initial input value correctly', () => {
    const clearInitialInputValue = vi.fn();
    
    // Mock useInitialInput to simulate having initial input
    vi.mocked(useInitialInput).mockReturnValueOnce({
      hasInitialInput: true,
    });

    // Mock useMessageHandler to return the initial input value
    vi.mocked(useMessageHandler).mockReturnValueOnce({
      messages: [],
      isProcessing: false,
      inputValue: 'Initial message',
      setInputValue: vi.fn(),
      handleSendMessage: vi.fn(),
      handleSelectQuery: vi.fn(),
      handleSecurityRemediation: vi.fn(),
      handleActionSelection: vi.fn(),
      showCIConfig: false,
      repository: null,
      fullReset: vi.fn(),
    });

    // Mock useTypingAnimation to return empty messages
    vi.mocked(useTypingAnimation).mockReturnValueOnce({
      getAnimatedMessages: () => [],
      isAnimatingResponse: false,
    });

    render(
      <AIChat 
        initialInputValue="Initial message"
        clearInitialInputValue={clearInitialInputValue}
      />
    );

    // Check that the input value is set in the ChatInput
    const textarea = screen.getByTestId('chat-textarea');
    expect(textarea).toHaveValue('Initial message');
  });

  it('notifies parent about chat state changes', () => {
    const onChatStateChange = vi.fn();
    
    render(<AIChat onChatStateChange={onChatStateChange} />);
    
    expect(useChatStateNotifier).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.any(Array),
        onChatStateChange,
      })
    );
  });

  it('handles auto-sending messages when shouldSendMessage is true', () => {
    const clearShouldSendMessage = vi.fn();
    
    render(
      <AIChat 
        shouldSendMessage={true}
        clearShouldSendMessage={clearShouldSendMessage}
      />
    );

    expect(useAutoSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldSendMessage: true,
        clearShouldSendMessage,
      })
    );
  });
}); 
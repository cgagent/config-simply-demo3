
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

interface AIConfigurationChatProps {
  repositoryName?: string;
}

const AIConfigurationChat: React.FC<AIConfigurationChatProps> = ({ repositoryName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `Hi! I'm your FlyFrog CI configuration assistant. I can help you set up CI integration for ${repositoryName || 'your repository'}. What CI server are you using (GitHub Actions, Circle CI, or another platform)?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let response = '';
      
      // Very simple rule-based responses for demo purposes
      if (/github|actions/i.test(input)) {
        response = `Great! GitHub Actions is a popular choice. For your ${repositoryName || 'repository'}, you'll need to add the FlyFrog configuration to your workflow file. Which package managers do you use? (npm, docker, python, etc.)`;
      } else if (/npm|node|javascript|typescript/i.test(input)) {
        response = `I'll add npm configuration to your setup. Here's a snippet you can add to your workflow file:
        
\`\`\`yaml
- name: Setup FlyFrog
  uses: jfrog/setup-flyfrog@v1
  with:
    subdomain: acme

- name: Install npm dependencies
  run: npm install
\`\`\`

Would you like to add any other package managers?`;
      } else if (/docker|container/i.test(input)) {
        response = `I'll add Docker configuration to your setup. Here's what you'll need:
        
\`\`\`yaml
- name: Setup FlyFrog
  uses: jfrog/setup-flyfrog@v1
  with:
    subdomain: acme

- name: Build Docker image
  run: docker build -t ${repositoryName || 'your-image'}:latest .
\`\`\`

Is there anything else you need help with?`;
      } else if (/complete|done|finished|full|example/i.test(input)) {
        response = `Here's a complete GitHub Actions workflow for ${repositoryName || 'your repository'}:
        
\`\`\`yaml
name: CI Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup FlyFrog
        uses: jfrog/setup-flyfrog@v1
        with:
          subdomain: acme
          
      - name: Install dependencies
        run: npm install
        
      # Add other build steps as needed
\`\`\`

Once you add this file to your repository and merge it to your main branch, FlyFrog will be connected with your workflow.`;
      } else {
        response = `I understand you're asking about "${input}". To configure FlyFrog with your CI workflow, I need to know which CI server you're using (GitHub Actions, Circle CI, etc.) and which package managers your project uses (npm, docker, python, etc.). Could you provide more details?`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    // Extract code blocks
    const codeBlockMatch = text.match(/```yaml([\s\S]*?)```/);
    const codeToCopy = codeBlockMatch ? codeBlockMatch[1].trim() : text;
    
    navigator.clipboard.writeText(codeToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Configuration snippet copied successfully",
      });
    });
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-primary p-3">
        <h3 className="text-white font-medium flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          FlyFrog AI Configuration Assistant
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-12' 
                  : 'bg-muted mr-12'
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === 'bot' ? (
                  <Bot className="w-4 h-4 mr-2" />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                <span className="text-xs font-medium">
                  {message.role === 'bot' ? 'FlyFrog Assistant' : 'You'}
                </span>
              </div>
              
              <div className="whitespace-pre-wrap">
                {message.content.includes('```') ? (
                  <>
                    {message.content.split('```').map((part, i) => {
                      if (i % 2 === 0) {
                        return <p key={i} className="mb-2">{part}</p>;
                      } else {
                        const language = part.split('\n')[0];
                        const code = part.split('\n').slice(1).join('\n');
                        return (
                          <div key={i} className="relative">
                            <pre className="p-3 bg-black text-white rounded-md overflow-x-auto text-sm mb-2">
                              <code>{code}</code>
                            </pre>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="absolute top-2 right-2 h-8 opacity-80"
                              onClick={() => copyToClipboard(part)}
                            >
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </Button>
                          </div>
                        );
                      }
                    })}
                  </>
                ) : (
                  message.content
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about CI configuration..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIConfigurationChat;

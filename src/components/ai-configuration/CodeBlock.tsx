import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  content: string;
  onCopy: (text: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ content, onCopy }) => {
  return (
    <>
      {content.split('```').map((part, i) => {
        if (i % 2 === 0) {
          return <p key={i} className="mb-2">{part}</p>;
        } else {
          const firstLine = part.split('\n')[0];
          const language = firstLine.trim();
          const code = part.split('\n').slice(1).join('\n');
          const isDiff = language === 'diff';
          
          // Function to handle rendering of diff code with syntax highlighting
          const renderDiffCode = (diffCode: string) => {
            return diffCode.split('\n').map((line, lineIndex) => {
              let bgColor = '';
              let textColor = 'text-white';
              
              if (line.startsWith('+')) {
                bgColor = 'bg-green-950';
                textColor = 'text-green-300';
              } else if (line.startsWith('-')) {
                bgColor = 'bg-red-950';
                textColor = 'text-red-300';
              } else if (line.startsWith('@')) {
                bgColor = 'bg-blue-950';
                textColor = 'text-blue-300';
              }
              
              return (
                <div 
                  key={lineIndex} 
                  className={cn("px-1", bgColor, textColor)}
                >
                  {line}
                </div>
              );
            });
          };
          
          return (
            <div key={i} className="relative">
              <pre className="p-3 bg-black text-white rounded-md overflow-x-auto text-sm mb-2">
                {isDiff ? (
                  renderDiffCode(code)
                ) : (
                  <code>{code}</code>
                )}
              </pre>
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute top-2 right-2 h-8 opacity-80"
                onClick={() => onCopy(code)}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
          );
        }
      })}
    </>
  );
};

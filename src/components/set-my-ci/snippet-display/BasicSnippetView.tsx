
import React from 'react';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

interface BasicSnippetViewProps {
  snippet: string;
  onCopy: (text: string, message: string) => void;
}

const BasicSnippetView: React.FC<BasicSnippetViewProps> = ({ snippet, onCopy }) => {
  return (
    <div className="bg-gray-50 rounded-md p-2 border border-gray-300 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-medium text-gray-800">Configuration snippet:</Label>
        <button 
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center"
          onClick={() => onCopy(snippet, "Snippet copied to clipboard")}
        >
          <Copy size={12} className="mr-1" />
          Copy
        </button>
      </div>
      <pre className="p-2 bg-gray-900 text-white rounded-md overflow-x-auto text-xs border border-gray-700 shadow-inner">
        {snippet}
      </pre>
    </div>
  );
};

export default BasicSnippetView;


import React from 'react';
import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SetupSnippetTabProps {
  snippet: string;
  onCopy: (text: string, message: string) => void;
}

const SetupSnippetTab: React.FC<SetupSnippetTabProps> = ({ snippet, onCopy }) => {
  return (
    <div className="bg-gray-50 rounded-md p-2 border border-gray-300 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-medium text-gray-800">Add this snippet to set up JFrog:</Label>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white border-gray-300 hover:bg-gray-100 h-6 px-2 py-0.5 text-xs" 
          onClick={() => onCopy(snippet, "Setup snippet copied")}
        >
          <CopyIcon className="h-3 w-3 mr-1 text-gray-600" />
          Copy
        </Button>
      </div>
      <pre className="p-2 bg-gray-900 text-white rounded-md overflow-x-auto text-xs border border-gray-700 shadow-inner">
        {snippet}
      </pre>
    </div>
  );
};

export default SetupSnippetTab;

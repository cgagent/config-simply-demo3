
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';

interface SnippetActionButtonsProps {
  onCopy: () => void;
  onDownload: () => void;
}

const SnippetActionButtons: React.FC<SnippetActionButtonsProps> = ({ onCopy, onDownload }) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-blue-300 hover:text-white hover:bg-blue-900/60"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4 mr-1" />
        Copy
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-blue-300 hover:text-white hover:bg-blue-900/60"
        onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
    </div>
  );
};

export default SnippetActionButtons;


import React from 'react';
import { Code, FileText } from 'lucide-react';

interface SnippetViewTabsProps {
  viewMode: 'snippet' | 'full';
  setViewMode: (mode: 'snippet' | 'full') => void;
}

const SnippetViewTabs: React.FC<SnippetViewTabsProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="border-b border-gray-200 pb-2 mb-3">
      <div className="flex gap-2 items-center">
        <div className="bg-gray-100 p-0.5 rounded-md flex text-xs">
          <button
            onClick={() => setViewMode('snippet')}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === 'snippet' 
                ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Code size={14} className="mr-1.5" />
            Basic Snippet
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === 'full' 
                ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={14} className="mr-1.5" />
            Full Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetViewTabs;


import React from 'react';

interface SnippetViewTabsProps {
  viewMode: 'snippet' | 'full';
  setViewMode: (mode: 'snippet' | 'full') => void;
}

const SnippetViewTabs: React.FC<SnippetViewTabsProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex space-x-2">
      <button 
        className={`px-3 py-1 rounded-md text-sm ${viewMode === 'snippet' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
        onClick={() => setViewMode('snippet')}
      >
        JFrog CI Setup Snippet
      </button>
      <button 
        className={`px-3 py-1 rounded-md text-sm ${viewMode === 'full' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
        onClick={() => setViewMode('full')}
      >
        Full CI Workflow Example
      </button>
    </div>
  );
};

export default SnippetViewTabs;

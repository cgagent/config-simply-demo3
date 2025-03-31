
import React from 'react';

interface CodeDisplayProps {
  content: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ content }) => {
  return (
    <pre className="bg-gray-900 text-blue-100 p-3 rounded overflow-x-auto text-sm border border-gray-700">
      {content}
    </pre>
  );
};

export default CodeDisplay;

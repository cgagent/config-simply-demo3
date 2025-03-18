
import React from 'react';
import { AIConfigurationChat } from '@/components/ai-configuration';

const CIConfigurationPage: React.FC = () => {
  const repositoryName = 'example-repo'; // This could be dynamic based on context

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">CI Configuration</h1>
      <div className="mb-8">
        <AIConfigurationChat repositoryName={repositoryName} />
      </div>
    </div>
  );
};

export default CIConfigurationPage;

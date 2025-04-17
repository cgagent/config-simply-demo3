import React, { useEffect } from 'react';
import { AIConfigurationChat } from '@/components/ai-configuration';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useRepositories, PackageManagerType } from '@/contexts/RepositoryContext';

const CIConfigurationPage: React.FC = () => {
  const location = useLocation();
  
  // Use the shared repository context
  const { repositories, updateRepositoryStatus } = useRepositories();
  
  // Always use 'infrastructure' as the repository name for this demo
  const repositoryName = 'infrastructure';
  
  // Use the shared repository update function
  const handleMergeSuccess = (repoName: string, packageType: PackageManagerType) => {
    // Get the current repository state
    const currentRepo = repositories.find(repo => repo.name === repoName);
    
    // Always update the status - the animation and state tracking is handled in the context
    updateRepositoryStatus(repoName, packageType);
  };

  return (
    <motion.div 
      className="flex flex-col h-screen container mx-auto py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
    
      </motion.h1>
      
      <motion.div 
        className="flex-1 bg-card rounded-xl overflow-hidden shadow-lg flex flex-col"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AIConfigurationChat 
          repositoryName={repositoryName} 
          onMergeSuccess={handleMergeSuccess}
        />
      </motion.div>
    </motion.div>
  );
};

export default CIConfigurationPage;

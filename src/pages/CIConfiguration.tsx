
import React from 'react';
import { AIConfigurationChat } from '@/components/ai-configuration';
import { motion } from 'framer-motion';

const CIConfigurationPage: React.FC = () => {
  const repositoryName = 'example-repo'; // This could be dynamic based on context

  return (
    <motion.div 
      className="container mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        CI Configuration
      </motion.h1>
      
      <motion.div 
        className="mb-8 bg-card rounded-xl overflow-hidden shadow-lg"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AIConfigurationChat repositoryName={repositoryName} />
      </motion.div>
    </motion.div>
  );
};

export default CIConfigurationPage;

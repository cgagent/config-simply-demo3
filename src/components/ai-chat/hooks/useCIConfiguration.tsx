
import { useState } from 'react';

export const useCIConfiguration = () => {
  const [showCIConfig, setShowCIConfig] = useState(false);
  const [repository, setRepository] = useState<any>(null);

  const handleCIConfiguration = (content: string) => {
    const lowerContent = content.toLowerCase().trim();
    
    // Check if this is a CI Setup query
    if (lowerContent.includes('ci') && 
        (lowerContent.includes('setup') || lowerContent.includes('assist'))) {
      
      // Show embedded CI configuration
      setRepository({
        id: 'sample-repo-1',
        name: 'sample-repository',
        owner: 'jfrog',
        isConfigured: false,
        language: 'JavaScript'
      });
      setShowCIConfig(true);
      
      return {
        handled: true,
        response: "I'll help you set up CI integration. Let me bring up our CI configuration assistant:"
      };
    }
    
    return { handled: false };
  };

  const resetCIConfiguration = () => {
    setShowCIConfig(false);
    setRepository(null);
  };

  return {
    showCIConfig,
    repository,
    handleCIConfiguration,
    resetCIConfiguration
  };
};

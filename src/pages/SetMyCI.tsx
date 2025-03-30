
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AIConfigurationChat } from '@/components/ai-configuration';

const SetMyCI = () => {
  const navigate = useNavigate();
  
  // Handle going back to previous page
  const handleGoBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 mt-8">
        <div className="animate-fadeIn">
          <div className="flex items-center mb-3">
            <Button 
              variant="outline" 
              className="mr-2 text-gray-700 border-gray-300 py-1 px-2 h-7" 
              onClick={handleGoBack}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              Set My CI
            </h1>
          </div>

          <div className="space-y-3">
            {/* Initialize the chat with CI setup mode */}
            <AIConfigurationChat initialMode="ci-setup" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetMyCI;

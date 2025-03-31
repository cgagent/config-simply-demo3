
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface ApiKeyInstructionsProps {
  selectedCI: 'github' | 'other' | null;
}

const ApiKeyInstructions: React.FC<ApiKeyInstructionsProps> = ({ selectedCI }) => {
  return (
    <Accordion type="single" collapsible className="bg-gray-800 rounded-md p-4 shadow-lg">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-white font-semibold flex items-center py-2">
          <HelpCircle className="h-4 w-4 mr-2 text-blue-300" />
          <span>How to set up API keys in your CI environment</span>
        </AccordionTrigger>
        <AccordionContent className="text-blue-100 text-sm">
          <div className="space-y-3 p-2">
            <p>
              Your JFrog configuration requires an API key to authenticate with your JFrog platform. Here's how to set it up securely:
            </p>
            
            {selectedCI === 'github' ? (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-300">For GitHub Actions:</h4>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Go to your GitHub repository &gt; Settings &gt; Secrets and variables &gt; Actions</li>
                  <li>Click "New repository secret"</li>
                  <li>Name: <code className="bg-gray-700 px-1 rounded">JFROG_API_KEY</code></li>
                  <li>Value: Your JFrog API key or access token</li>
                  <li>Click "Add secret"</li>
                </ol>
                <p className="mt-2 text-xs">
                  The workflow will automatically use this secret as shown in the examples above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-300">For Jenkins/Other CI:</h4>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Go to your CI system's credential management</li>
                  <li>Add a new credential named <code className="bg-gray-700 px-1 rounded">jfrog-api-key</code></li>
                  <li>Store your JFrog API key as the credential value</li>
                  <li>Reference it in your pipeline as shown in the example</li>
                </ol>
                <p className="mt-2 text-xs">
                  For other CI systems, refer to their documentation on how to store and access secrets.
                </p>
              </div>
            )}
            
            <div className="bg-blue-900/30 p-2 rounded mt-3 border border-blue-700/50">
              <p className="text-xs">
                <strong>Security Tip:</strong> Never hardcode API keys directly in your workflow files.
                Always use your CI system's secret management features.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ApiKeyInstructions;

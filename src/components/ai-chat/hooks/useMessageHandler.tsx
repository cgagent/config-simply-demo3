/**
 * Message Handler Hook
 * 
 * This hook manages the message handling logic for the AI chat interface.
 * It provides functions for sending messages, handling user actions, and managing
 * the chat state.
 * 
 * SCOPE:
 * - Managing chat messages and their state
 * - Handling user message sending and processing
 * - Managing action selections and security remediation
 * - Tracking UI state like processing indicators and input values
 * - Managing CI configuration visibility
 * 
 * BOUNDARIES:
 * ⚠️ IMPORTANT: This hook should NOT contain business logic! ⚠️
 * Business logic should be added to the appropriate config files:
 * - New response patterns → /config/patterns/
 * - New conversation flows → /config/flows/
 * - New response templates → /config/responses/
 * 
 * This hook should NOT:
 * - Handle direct API calls to external services
 * - Manage authentication or user data
 * - Handle routing or navigation
 * - Directly render UI components
 * - Contain response templates or pattern matching logic
 * - Define new conversation flows or response patterns
 * 
 * This hook acts as a coordinator between UI components and business logic services.
 * It should only coordinate and delegate to the appropriate config modules.
 */
import { useToast } from '@/hooks/use-toast';
import { useMessageState } from './useMessageState';
import { ChatOption } from '@/components/shared/types';
import { generateSecurityRemediationResponse } from '../config/responses/securityResponses';
import { Repository } from '../config/patterns/ciPatterns';
import { isConfirmationMessage } from '../config/patterns/confirmationPatterns';
import { getRandomResponse, getCurrentActionOptions, simulateAIResponse, getCurrentFlow, getCurrentStep, setRepositoryData } from '../utils/aiResponseUtils';
import { useState, useEffect, useCallback } from 'react';
import { MessageFactory } from '../utils/messageFactory';
import { conversationFlows } from '../config/flows';
import { useFlow } from '../context/FlowContext';
import { registerFlowStateGetter } from '../utils/flowStateUtils';
import { RELEASE_FLOW_ID, RELEASE_FLOW_FIELDS } from '../config/flows/releaseFlow';
import { 
  RELEASE_PACKAGE_NAME_ACTIONS, 
  BRANCH_SELECTION_ACTIONS, 
  ENVIRONMENT_SELECTION_ACTIONS, 
  RELEASE_TYPE_SELECTION_ACTIONS 
} from '../config/constants/releaseConstants';
import { useRepositories } from '@/contexts/RepositoryContext';
import { PackageTableMessage, isPackageTableMessage } from '../types/messageTypes';
import { formatDistanceToNow } from 'date-fns';
import { PACKAGE_FLOW_ID, packageFollowUpOptions } from '../config/flows/packageFlow';


export const useMessageHandler = () => {
  const { toast } = useToast();
  const [showCIConfig, setShowCIConfig] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const { 
    currentFlowId, 
    setCurrentFlow, 
    updateFlowState, 
    getFlowState, 
    resetAllFlowStates 
  } = useFlow();
  
  const {
    messages,
    isProcessing,
    setIsProcessing,
    inputValue,
    setInputValue,
    addUserMessage,
    addBotMessage,
    resetMessages
  } = useMessageState();

  // Get repositories context
  const { repositories, packageStats } = useRepositories();

  // Set repository data for the AI response utils
  useEffect(() => {
    console.log("Setting repository data with packages:", JSON.stringify(packageStats.latestPackages, null, 2));
    setRepositoryData({ 
      latestPackages: packageStats.latestPackages 
    });
  }, [packageStats.latestPackages]);

  // Register the state getters for each flow once on mount
  useEffect(() => {
    // Register a getter for the release flow
    registerFlowStateGetter(RELEASE_FLOW_ID, () => getFlowState(RELEASE_FLOW_ID));
    
    // Register getters for other flows here as they're added
    // Example: registerFlowStateGetter('config', () => getFlowState('config'));
  }, [getFlowState]);

  // Update the current flow ID when it changes in the AI response utils
  useEffect(() => {
    const flowId = getCurrentFlow();
    if (flowId !== currentFlowId) {
      setCurrentFlow(flowId);
    }
  }, [currentFlowId, setCurrentFlow]);

  /**
   * Map option ID and flow ID to the appropriate field update
   */
  const updateFlowStateFromOption = (flowId: string, optionId: string, optionValue: string) => {
    // Handle release flow selections
    if (flowId === RELEASE_FLOW_ID) {
      // Package name selections
      if (optionId === 'common' || optionId === 'frontend-app' || optionId === 'backend-api') {
        updateFlowState(flowId, RELEASE_FLOW_FIELDS.PACKAGE_NAME, optionValue);
      }
      // Branch selections
      else if (optionId === 'main' || optionId === 'develop' || optionId === 'feature') {
        updateFlowState(flowId, RELEASE_FLOW_FIELDS.BRANCH, optionValue);
      }
      // Environment selections
      else if (optionId === 'dev' || optionId === 'staging' || optionId === 'prod') {
        updateFlowState(flowId, RELEASE_FLOW_FIELDS.ENVIRONMENT, optionValue);
      }
      // Release type selections
      else if (optionId === 'major' || optionId === 'minor' || optionId === 'patch') {
        updateFlowState(flowId, RELEASE_FLOW_FIELDS.RELEASE_TYPE, optionValue);
      }
    }
    
    // Add logic for other flows as they're added
    // Example:
    // if (flowId === 'config') {
    //   // Handle config flow selections
    // }
  };

  /**
   * Generic handler for processing user action selections in conversation flows
   */
  const handleActionSelection = (option: ChatOption) => {
    // Add user's selection as a message
    addUserMessage(option.value);
    setIsProcessing(true);

    // Get the current flow and step
    const currentFlowId = getCurrentFlow();
    const currentStepId = getCurrentStep();

    // If there's a current flow, update its state
    if (currentFlowId) {
      updateFlowStateFromOption(currentFlowId, option.id, option.value);
    }

    // Find the current flow configuration
    const currentFlow = conversationFlows.find(flow => flow.id === currentFlowId);

    if (currentFlow) {
      // Find the current step configuration
      const currentStepData = currentFlow.steps.find(step => step.id === currentStepId);

      if (currentStepData) {
        // Process the selection based on the current flow and step
        setTimeout(() => {
          try {
            // Simulate the response to update the conversation state
            simulateAIResponse(option.value);
            
            // Get the next step based on the configuration
            const nextStepId = currentStepData.nextSteps?.[0];
            
            if (nextStepId) {
              // Find the next step configuration
              const nextStepData = currentFlow.steps.find(step => step.id === nextStepId);
              
              if (nextStepData) {
                // Get the response text and action options from the configuration
                const responseText = typeof nextStepData.response === 'function' 
                  ? nextStepData.response(option.value)
                  : nextStepData.response;
                
                const actionOptions = nextStepData.actionOptions || [];
                
                // Create and add the response message
                if (actionOptions.length > 0) {
                  const actionOptionsMessage = MessageFactory.createActionOptionsMessage(
                    responseText, 
                    actionOptions
                  );
                  addBotMessage(actionOptionsMessage);
                } else {
                  addBotMessage(responseText);
                }
              }
            } else {
              // End of flow - no next steps
              const finalResponse = "Flow completed successfully.";
              addBotMessage(finalResponse);
            }
          } catch (error) {
            console.error("Error processing selection:", error);
            addBotMessage("I encountered an error processing your selection. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        }, 1000);
      } else {
        // Handle case where current step is not found
        setTimeout(() => {
          try {
            addBotMessage("I encountered an error processing your selection. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        }, 1000);
      }
    } else {
      // Handle standalone actions (like security remediation)
      setTimeout(() => {
        try {
          const response = generateSecurityRemediationResponse(option.id);
          addBotMessage(response);
        } catch (error) {
          console.error("Error handling action:", error);
          addBotMessage("I encountered an error processing your selection. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      }, 1000);
    }
  };

  // For backward compatibility, keep the old function name but make it call the new one
  const handleSecurityRemediation = useCallback((option: ChatOption) => {
    console.log("Handling option selection:", option);
    handleActionSelection(option);
  }, [handleActionSelection]);

  /**
   * Generic handler for processing user messages
   */
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addUserMessage(content);
    setIsProcessing(true);
    
    try {
      // Enhanced logging for debugging
      console.log("Original content:", content);
      
      // Process the message with a slight delay to simulate processing
      setTimeout(() => {
        try {
          // Store the current flow and step before processing
          const beforeFlowId = getCurrentFlow();
          const beforeStepId = getCurrentStep();
          
          console.log("Before processing - Current flow and step:", {
            currentFlow: beforeFlowId,
            currentStep: beforeStepId
          });
          
          // Get the AI response using the existing utility
          const aiResponse = getRandomResponse(content);
          
          // Check if the flow or step has changed
          const afterFlowId = getCurrentFlow();
          const afterStepId = getCurrentStep();
          
          // If the flow changed, update the context
          if (beforeFlowId !== afterFlowId) {
            setCurrentFlow(afterFlowId);
          }
          
          console.log("After processing - Current flow and step:", {
            currentFlow: afterFlowId,
            currentStep: afterStepId
          });
          
          // Check if there are action options for this response
          const actionOptions = getCurrentActionOptions();
          
          // Check if this is a confirmation message using the configuration
          const isConfirmation = isConfirmationMessage(content);
          
          // If the flow or step has changed, get the current step data
          if ((beforeFlowId !== afterFlowId) || (beforeStepId !== afterStepId)) {
            console.log("Flow or step changed, getting response from new step");
            // Find the current flow configuration
            const currentFlow = conversationFlows.find(flow => flow.id === afterFlowId);
            if (currentFlow) {
              // Find the current step configuration
              const currentStepData = currentFlow.steps.find(step => step.id === afterStepId);
              if (currentStepData) {
                // Get the response text from the configuration
                const responseText = typeof currentStepData.response === 'function' 
                  ? currentStepData.response(content)
                  : currentStepData.response;
                
                // Check for special placeholder responses
                if (responseText === "SHOW_PACKAGES_TABLE") {
                  // Generate package table markdown response
                  console.log("Handling SHOW_PACKAGES_TABLE with updated packages");
                  
                  try {
                    // Get the latest package data from our hook
                    const { latestPackages } = repositories.length > 0 
                      ? packageStats 
                      : { latestPackages: [] };
                    
                    console.log("Raw packages from packageStats:", JSON.stringify(latestPackages, null, 2));
                    
                    if (!latestPackages || latestPackages.length === 0) {
                      addBotMessage("I couldn't find any recent packages in your organization.");
                      setIsProcessing(false);
                      return;
                    }
                    
                    // Get packages directly from localStorage if needed for debugging
                    /*
                    try {
                      const storedStats = localStorage.getItem('package_statistics');
                      if (storedStats) {
                        const parsedStats = JSON.parse(storedStats);
                        console.log("Packages from localStorage:", JSON.stringify(parsedStats.latestPackages, null, 2));
                      }
                    } catch (e) {
                      console.error("Failed to load packages from localStorage:", e);
                    }
                    */
                    
                    // Hard-coded packages for testing if needed
                    const backupPackages = [
                      {
                        id: "1",
                        name: "frontend-app",
                        version: "2.4.0",
                        type: "docker",
                        releaseDate: new Date(new Date().getTime() - (30 * 1000)).toISOString(),
                        repository: "frontend-app",
                        status: "passed",
                        versions: 5
                      },
                      {
                        id: "2",
                        name: "user-service",
                        version: "1.7.3",
                        type: "docker",
                        releaseDate: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString(),
                        repository: "user-service",
                        status: "passed",
                        versions: 8
                      },
                      {
                        id: "3",
                        name: "analytics-dashboard",
                        version: "0.9.1",
                        type: "npm",
                        releaseDate: new Date(new Date().getTime() - (12 * 60 * 60 * 1000)).toISOString(),
                        repository: "analytics",
                        status: "warning",
                        versions: 3
                      },
                      {
                        id: "4",
                        name: "infra-utilities",
                        version: "3.1.0",
                        type: "npm",
                        releaseDate: new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
                        repository: "infrastructure",
                        status: "passed",
                        versions: 11
                      },
                      {
                        id: "5",
                        name: "api-gateway",
                        version: "1.0.0",
                        type: "docker",
                        releaseDate: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
                        repository: "api-gateway",
                        status: "passed",
                        versions: 1
                      }
                    ];
                    
                    // Use backup packages as fallback
                    const packagesToUse = latestPackages.length >= 5 ? latestPackages : backupPackages;
                    console.log("Using packages:", JSON.stringify(packagesToUse, null, 2));
                    
                    // Ensure packages are sorted by release date (newest first)
                    const sortedPackages = [...packagesToUse].sort((a, b) => 
                      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
                    );
                    
                    // Format packages for table
                    const formattedPackages = sortedPackages.slice(0, 5).map(pkg => ({
                      type: pkg.type,
                      name: pkg.name,
                      version: pkg.version,
                      firstCreated: formatDistanceToNow(new Date(pkg.releaseDate), { addSuffix: true }),
                      versions: pkg.versions || 1,
                      status: pkg.status
                    }));
                    
                    console.log("Formatted packages for display:", JSON.stringify(formattedPackages, null, 2));
                    
                    // Create a package table message with follow-up options
                    const message = MessageFactory.createPackageTableMessage(
                      "Here are the latest 5 packages published in your organization:",
                      formattedPackages,
                      packageFollowUpOptions
                    );
                    
                    addBotMessage(message);
                    setIsProcessing(false);
                    return;
                  } catch (error) {
                    console.error("Error generating package table:", error);
                    addBotMessage("I encountered an error displaying the package table. Please try again.");
                  }
                }
                
                // Check if there are action options defined for this step
                const stepActionOptions = currentStepData.actionOptions || [];
                
                // Create and add the appropriate response message
                if (stepActionOptions.length > 0) {
                  const actionOptionsMessage = MessageFactory.createActionOptionsMessage(
                    responseText, 
                    stepActionOptions
                  );
                  addBotMessage(actionOptionsMessage);
                } else {
                  // No action options, just send the text response
                  addBotMessage(responseText);
                }
                
                // Return early since we've handled the response
                return;
              }
            }
          }
          
          // Special handling for PackageTableMessage
          if (typeof aiResponse === 'object' && 
              'packages' in aiResponse && 
              Array.isArray(aiResponse.packages) && 
              'type' in aiResponse && 
              aiResponse.type === 'package-table') {
            console.log("Detected PackageTableMessage with packages array");
            // Just add the message directly - we now rely on the packageResponses to format it correctly
            addBotMessage(aiResponse);
            setIsProcessing(false);
            return;
          }
          
          // Special handling for the SHOW_PACKAGES_TABLE placeholder
          if (aiResponse === 'SHOW_PACKAGES_TABLE') {
            // Generate package table markdown response
            console.log("Handling SHOW_PACKAGES_TABLE with updated packages");
            
            try {
              // Get the latest package data from our hook
              const { latestPackages } = repositories.length > 0 
                ? packageStats 
                : { latestPackages: [] };
              
              console.log("Raw packages from packageStats:", JSON.stringify(latestPackages, null, 2));
              
              if (!latestPackages || latestPackages.length === 0) {
                addBotMessage("I couldn't find any recent packages in your organization.");
                setIsProcessing(false);
                return;
              }
              
              // Get packages directly from localStorage if needed for debugging
              /*
              try {
                const storedStats = localStorage.getItem('package_statistics');
                if (storedStats) {
                  const parsedStats = JSON.parse(storedStats);
                  console.log("Packages from localStorage:", JSON.stringify(parsedStats.latestPackages, null, 2));
                }
              } catch (e) {
                console.error("Failed to load packages from localStorage:", e);
              }
              */
              
              // Hard-coded packages for testing if needed
              const backupPackages = [
                {
                  id: "1",
                  name: "frontend-app",
                  version: "2.4.0",
                  type: "docker",
                  releaseDate: new Date(new Date().getTime() - (30 * 1000)).toISOString(),
                  repository: "frontend-app",
                  status: "passed",
                  versions: 5
                },
                {
                  id: "2",
                  name: "user-service",
                  version: "1.7.3",
                  type: "docker",
                  releaseDate: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString(),
                  repository: "user-service",
                  status: "passed",
                  versions: 8
                },
                {
                  id: "3",
                  name: "analytics-dashboard",
                  version: "0.9.1",
                  type: "npm",
                  releaseDate: new Date(new Date().getTime() - (12 * 60 * 60 * 1000)).toISOString(),
                  repository: "analytics",
                  status: "warning",
                  versions: 3
                },
                {
                  id: "4",
                  name: "infra-utilities",
                  version: "3.1.0",
                  type: "npm",
                  releaseDate: new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
                  repository: "infrastructure",
                  status: "passed",
                  versions: 11
                },
                {
                  id: "5",
                  name: "api-gateway",
                  version: "1.0.0",
                  type: "docker",
                  releaseDate: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
                  repository: "api-gateway",
                  status: "passed",
                  versions: 1
                }
              ];
              
              // Use backup packages as fallback
              const packagesToUse = latestPackages.length >= 5 ? latestPackages : backupPackages;
              console.log("Using packages:", JSON.stringify(packagesToUse, null, 2));
              
              // Ensure packages are sorted by release date (newest first)
              const sortedPackages = [...packagesToUse].sort((a, b) => 
                new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
              );
              
              // Format packages for table
              const formattedPackages = sortedPackages.slice(0, 5).map(pkg => ({
                type: pkg.type,
                name: pkg.name,
                version: pkg.version,
                firstCreated: formatDistanceToNow(new Date(pkg.releaseDate), { addSuffix: true }),
                versions: pkg.versions || 1,
                status: pkg.status
              }));
              
              console.log("Formatted packages for display:", JSON.stringify(formattedPackages, null, 2));
              
              // Create a package table message with follow-up options
              const message = MessageFactory.createPackageTableMessage(
                "Here are the latest 5 packages published in your organization:",
                formattedPackages,
                packageFollowUpOptions
              );
              
              addBotMessage(message);
              setIsProcessing(false);
              return;
            } catch (error) {
              console.error("Error generating package table:", error);
              addBotMessage("I encountered an error displaying the package table. Please try again.");
            }
          }
          
          // If we get here, either no flow/step change was detected or the new step couldn't be found
          // Use the default response handling logic
          if (actionOptions && actionOptions.length > 0 && !isConfirmation) {
            // Create an action options message
            const actionOptionsMessage = MessageFactory.createActionOptionsMessage(aiResponse, actionOptions);
            addBotMessage(actionOptionsMessage);
          } else {
            // Send a regular text message
            addBotMessage(aiResponse);
          }
        } catch (error) {
          console.error("Error generating AI response:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to generate response. Please try again."
          });
        } finally {
          setIsProcessing(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your message. Please try again."
      });
      setIsProcessing(false);
    }
  };

  const handleSelectQuery = (query: string) => {
    setInputValue(query);
  };

  const fullReset = () => {
    resetMessages();
    resetAllFlowStates();
    setShowCIConfig(false);
    setRepository(null);
  };

  const handlePackagesQuery = (latestPackages: any) => {
    if (!latestPackages || !Array.isArray(latestPackages) || latestPackages.length === 0) {
      addBotMessage("Sorry, I couldn't find any recent packages.");
      return;
    }

    // Only show the 5 most recent packages
    const formattedPackages = latestPackages.slice(0, 5).map((pkg: any) => {
      // Assign a status to each package (for demonstration)
      const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'warning' : 'failed') : 'passed';
      return {
        type: pkg.type,
        name: pkg.name,
        version: pkg.latest_version || pkg.version,
        firstCreated: pkg.created_date,
        versions: pkg.versions_count || 1
      };
    });

    // Create a package table message with follow-up options
    const message = MessageFactory.createPackageTableMessage(
      "Here are the latest packages published in your organization:",
      formattedPackages,
      packageFollowUpOptions
    );
    
    addBotMessage(message);
  };

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSelectQuery,
    handleSecurityRemediation,
    handleActionSelection,
    fullReset,
    showCIConfig,
    repository
  };
};

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
import { TOKEN_FLOW_ID } from '../config/flows/tokenFlow';

// Original hook format
export const useMessageHandler = ({ 
  onTokenGenerated 
}: { 
  onTokenGenerated?: (token: string, name: string, expiration: string) => void 
} = {}) => {
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

  // Inside the useMessageHandler hook definition, add these state variables
  const [tokenFlowState, setTokenFlowState] = useState<null | {
    step: 'name' | 'expiration' | 'confirmation';
    tokenName?: string;
    tokenExpiration?: string;
  }>(null);

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

    // Handle send invites confirmation
    if (option.id === 'send-invites') {
      setTimeout(() => {
        addBotMessage("🎉 Done! Invitations have been sent.\nIs there anything else I can help you with?");
        setIsProcessing(false);
      }, 1500);
      return;
    }
    
    // Handle cancel invites
    if (option.id === 'cancel-invites') {
      setTimeout(() => {
        addBotMessage("No problem. You can invite users anytime by typing 'invite users' in the chat.");
        setIsProcessing(false);
      }, 1000);
      return;
    }
    
    // Legacy handling for old flow - can be removed when no longer needed
    // Handle user invitation flow responses 
    if (option.id === 'admin-role' || option.id === 'developer-role') {
      // Explicitly bypass other flows for user invitation
      setTimeout(() => {
        const role = option.id === 'admin-role' ? 'Admin' : 'Developer';
        addBotMessage(`Great! You've selected the ${role} role. Please provide the email addresses of the users you'd like to invite, separated by commas.`);
        setIsProcessing(false);
      }, 1000);
      return;
    }
    
    // Legacy handling for old flow - can be removed when no longer needed
    // Handle email input for user invitation - check for previous role message
    const lastMessages = messages.slice(-3);
    const roleSelectionMessage = lastMessages.find(msg => 
      msg.role === 'assistant' && 
      typeof msg.content === 'string' && 
      msg.content.includes("Please provide the email addresses")
    );
    
    if (roleSelectionMessage && option.id !== 'send-invites' && option.id !== 'maybe-later') {
      setTimeout(() => {
        // Treat this as email addresses
        const emails = option.value.split(',').map(email => email.trim()).filter(Boolean);
        
        if (emails.length > 0) {
          // Display email confirmation
          const emailsText = emails.map(email => `- ${email}`).join('\n');
          const message = MessageFactory.createActionOptionsMessage(
            `I'll send invitations to the following email addresses:\n\n${emailsText}\n\nWould you like to proceed?`,
            [
              { id: 'send-invites', label: 'Send Invites', value: 'Yes, send the invites' },
              { id: 'maybe-later', label: 'Cancel', value: 'No, maybe later' }
            ]
          );
          addBotMessage(message);
        } else {
          addBotMessage("I couldn't identify any email addresses. Please try again with valid email addresses separated by commas.");
        }
        setIsProcessing(false);
      }, 1000);
      return;
    }
    
    // Legacy handling for old flow - can be removed when no longer needed
    // Handle maybe later (cancel invites)
    if (option.id === 'maybe-later') {
      setTimeout(() => {
        addBotMessage("No problem. You can invite users anytime by typing 'invite users' in the chat.");
        setIsProcessing(false);
      }, 1000);
      return;
    }

    // Check if we're in the token flow
    if (tokenFlowState) {
      setTimeout(() => {
        try {
          if (tokenFlowState.step === 'expiration') {
            // Store the token expiration and move to confirmation step
            const tokenExpiration = option.value;
            setTokenFlowState({
              ...tokenFlowState,
              step: 'confirmation',
              tokenExpiration
            });
            
            // Show confirmation options
            const message = MessageFactory.createActionOptionsMessage(
              `**Token summary:**\n• Name: "${tokenFlowState.tokenName}"\n• Type: Read-only access\n• Expiration: ${tokenExpiration}\n\nGenerate this token now?`,
              [
                { id: 'confirm-yes', label: 'Generate Token', value: 'Yes' },
                { id: 'confirm-no', label: 'Cancel', value: 'No' }
              ]
            );
            addBotMessage(message);
          }
          else if (tokenFlowState.step === 'confirmation') {
            // Handle final confirmation
            if (option.id === 'confirm-yes') {
              // Generate a mock token with the specified pattern
              const mockToken = 'AKC' + Math.random().toString(36).substring(2, 4) + 
                              Math.random().toString(36).substring(2, 4).toUpperCase() + 
                              Math.random().toString(36).substring(2, 6) + 
                              Math.random().toString(36).substring(2, 6).toUpperCase() + 
                              Math.random().toString(36).substring(2, 6) +
                              Math.random().toString(36).substring(2, 6).toUpperCase();
              
              // End the token flow
              setTokenFlowState(null);
              
              // Show success message in chat (without the token)
              addBotMessage(`✅ Token generated successfully! The token has been displayed in a popup window.`);

              // Show token in modal
              if (onTokenGenerated) {
                onTokenGenerated(mockToken, tokenFlowState.tokenName || '', tokenFlowState.tokenExpiration || '');
              }
            } else {
              // Cancel token generation
              setTokenFlowState(null);
              addBotMessage(`Token generation cancelled.\n\nSay "generate token" to start over with different settings.`);
            }
          }
        } catch (error) {
          console.error("Error processing token action:", error);
          addBotMessage("I encountered an error processing your selection. Please try again.");
        } finally {
          setIsProcessing(false);
        }
        return;
      }, 1000);
      return;
    }

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
      // Process the message with a slight delay to simulate processing
      setTimeout(() => {
        try {
          // Check explicitly for user invitation flow first
          // This ensures it takes precedence over any other flow patterns
          if (content.toLowerCase().includes('invite a user') || 
              content.toLowerCase().includes('invite user') ||
              content.toLowerCase().includes('add a user') ||
              content.toLowerCase().includes('add user')) {
            
            console.log("Explicitly triggering simplified user invitation flow");
            
            // Show the new simplified user invitation message
            addBotMessage(`Of course! 🚀
To invite a user, please send me:

A list of email addresses

The role you'd like to assign (Developer or Admin)

You can write it like this:
👉 Invite alice@example.com, bob@example.com as Developer`);
            
            setIsProcessing(false);
            return;
          }
          
          // Check for the invitation pattern: "Invite [emails] as [role]"
          const invitePattern = /invite\s+(.+)\s+as\s+(developer|admin)/i;
          const inviteMatch = content.match(invitePattern);
          
          if (inviteMatch) {
            // Extract emails and role from the message
            const emailsText = inviteMatch[1];
            const role = inviteMatch[2].charAt(0).toUpperCase() + inviteMatch[2].slice(1).toLowerCase();
            
            // Parse emails
            const emails = emailsText.split(',').map(email => email.trim()).filter(Boolean);
            
            if (emails.length > 0) {
              // Format emails list
              const emailsList = emails.join(', ');
              
              // Show confirmation message
              const message = MessageFactory.createActionOptionsMessage(
                `Got it! Here's a quick summary:

Emails: ${emailsList}

Role: ${role}

Would you like me to send the invitations now?`,
                [
                  { id: 'send-invites', label: 'Yes', value: 'Yes' },
                  { id: 'cancel-invites', label: 'No', value: 'No' }
                ]
              );
              
              addBotMessage(message);
              setIsProcessing(false);
              return;
            } else {
              addBotMessage("I couldn't identify any email addresses. Please try again with valid email addresses.");
              setIsProcessing(false);
              return;
            }
          }
          
          // Continue with existing token flow check
          if (tokenFlowState) {
            // Handle token flow based on current step
            if (tokenFlowState.step === 'name') {
              // Store the token name and move to expiration step
              const tokenName = content.trim();
              setTokenFlowState({
                step: 'expiration',
                tokenName
              });
              
              // Show duration options
              const message = MessageFactory.createActionOptionsMessage(
                `Your token name will be "${tokenName}"\n\nWhat should be your token duration?`,
                [
                  { id: 'expiration-never', label: 'Never', value: 'Never' },
                  { id: 'expiration-1day', label: '1 Day', value: '1 Day' },
                  { id: 'expiration-3days', label: '3 Days', value: '3 Days' },
                  { id: 'expiration-7days', label: '7 Days', value: '7 Days' },
                  { id: 'expiration-1month', label: '1 Month', value: '1 Month' },
                  { id: 'expiration-1year', label: '1 Year', value: '1 Year' }
                ]
              );
              addBotMessage(message);
              setIsProcessing(false);
              return;
            } 
            else if (tokenFlowState.step === 'expiration') {
              // Store the token expiration and move to confirmation step
              const tokenExpiration = content.trim();
              setTokenFlowState({
                ...tokenFlowState,
                step: 'confirmation',
                tokenExpiration
              });
              
              // Show confirmation options
              const message = MessageFactory.createActionOptionsMessage(
                `**Token summary:**\n• Name: "${tokenFlowState.tokenName}"\n• Type: Read-only access\n• Expiration: ${tokenExpiration}\n\nGenerate this token now?`,
                [
                  { id: 'confirm-yes', label: 'Generate Token', value: 'Yes' },
                  { id: 'confirm-no', label: 'Cancel', value: 'No' }
                ]
              );
              addBotMessage(message);
              setIsProcessing(false);
              return;
            }
            else if (tokenFlowState.step === 'confirmation') {
              // Handle final confirmation
              if (content.toLowerCase().includes('yes') || content.toLowerCase().includes('generate')) {
                // Generate a mock token with the specified pattern
                const mockToken = 'AKC' + Math.random().toString(36).substring(2, 4) + 
                                Math.random().toString(36).substring(2, 4).toUpperCase() + 
                                Math.random().toString(36).substring(2, 6) + 
                                Math.random().toString(36).substring(2, 6).toUpperCase() + 
                                Math.random().toString(36).substring(2, 6) +
                                Math.random().toString(36).substring(2, 6).toUpperCase();
                
                // End the token flow
                setTokenFlowState(null);
                
                // Show success message
                addBotMessage(`✅ **Token generated**\n\n**Details:**\n• Type: Read-only\n• Token: \`${mockToken}\`\n\n⚠️ Copy this token now - it won't be displayed again.`);
              } else {
                // Cancel token generation
                setTokenFlowState(null);
                addBotMessage(`Token generation cancelled.\n\nSay "generate token" to start over with different settings.`);
              }
              setIsProcessing(false);
              return;
            }
          }
          
          // Check if this is starting a token flow
          if (content.toLowerCase().includes('token') || 
              content.toLowerCase().includes('generate token') || 
              content.includes('create token')) {
            
            // Start the token flow
            setTokenFlowState({
              step: 'name'
            });
            
            // Show initial prompt
            addBotMessage("To generate a new access token, please name it first with a descriptive name that will help you identify this token later.\n\nWhat would you like to name your token?");
            setIsProcessing(false);
            return;
          }
          
          // Store the current flow and step before processing
          const beforeFlowId = getCurrentFlow();
          const beforeStepId = getCurrentStep();
          
          console.log("Before processing - Current flow and step:", {
            currentFlow: beforeFlowId,
            currentStep: beforeStepId
          });
          
          // Get the AI response using the existing utility
          const aiResponse = getRandomResponse(content);
          
          // Add debugging for flow
          console.log("AI Response:", {
            content: content,
            response: aiResponse,
            currentFlow: getCurrentFlow(),
            currentStep: getCurrentStep()
          });
          
          // Process the AI response
          if (aiResponse) {
            if (Array.isArray(aiResponse) || typeof aiResponse === 'object') {
              addBotMessage(aiResponse);
            } else {
              addBotMessage(aiResponse.toString());
            }
          }
          
          setIsProcessing(false);
          return;
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

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
import { PACKAGE_PATTERNS } from '../config/patterns/packagePatterns';
import { getUsageSnippet } from '../utils/snippetGenerator';

// Original hook format
export const useMessageHandler = ({ 
  onTokenGenerated 
}: { 
  onTokenGenerated?: (token: string, name: string, expiration: string, isExternal: boolean) => void 
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
    isExternal?: boolean;
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
    setIsProcessing(true);

    // Handle token creation from Docker example
    if (option.id === 'create-docker-token') {
      // Process through handleSendMessage to ensure consistent token flow
      setIsProcessing(false); // Reset processing state before new flow
      // Don't add user message here since handleSendMessage will do it
      handleSendMessage(option.value);
      return;
    }
    
    // Handle send invites confirmation
    if (option.id === 'send-invites') {
      addUserMessage(option.value);
      setTimeout(() => {
        addBotMessage("🎉 Done! Invitations have been sent.\nIs there anything else I can help you with?");
        setIsProcessing(false);
      }, 1500);
      return;
    }
    
    // Handle cancel invites
    if (option.id === 'cancel-invites') {
      addUserMessage(option.value);
      setTimeout(() => {
        addBotMessage("No problem. You can invite users anytime by typing 'invite users' in the chat.");
        setIsProcessing(false);
      }, 1000);
      return;
    }
    
    // Legacy handling for old flow - can be removed when no longer needed
    // Handle user invitation flow responses 
    if (option.id === 'admin-role' || option.id === 'developer-role') {
      addUserMessage(option.value);
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
    if (tokenFlowState && tokenFlowState.step === 'confirmation') {
      addUserMessage(option.value);
      setTimeout(() => {
        try {
          if (option.id === 'confirm-yes') {
            // Generate a mock token with the specified pattern
            const mockToken = 'AKC' + Math.random().toString(36).substring(2, 4) + 
                           Math.random().toString(36).substring(2, 4).toUpperCase() + 
                           Math.random().toString(36).substring(2, 6) + 
                           Math.random().toString(36).substring(2, 6).toUpperCase() + 
                           Math.random().toString(36).substring(2, 6) +
                           Math.random().toString(36).substring(2, 6).toUpperCase();
            
            // Show token in modal
            if (onTokenGenerated) {
              onTokenGenerated(
                mockToken, 
                tokenFlowState.tokenName || '', 
                tokenFlowState.tokenExpiration || '',
                tokenFlowState.isExternal || false
              );
            }
            
            // Success message in chat without the token
            addBotMessage("🎉 Success! Your token has been generated.\nIs there anything else I can help you with?");
          } else if (option.id === 'confirm-no') {
            // Cancel token generation
            addBotMessage("Token generation cancelled. Let me know if you'd like to try again later.");
          }
          
          // End the token flow in either case
          setTokenFlowState(null);
        } catch (error) {
          console.error("Error processing token action:", error);
          addBotMessage("I encountered an error processing your request. Please try again.");
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
                  // Ensure responseText is a string
                  const messageText = typeof responseText === 'string' 
                    ? responseText 
                    : 'Please select an option:';
                  
                  const actionOptionsMessage = MessageFactory.createActionOptionsMessage(
                    messageText,
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
    // Clear input after sending
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Process the message with a slight delay to simulate processing
      setTimeout(() => {
        try {
          // Check if this is a package display request
          if (PACKAGE_PATTERNS.latestPackages.some(pattern => 
            content.toLowerCase().includes(pattern.toLowerCase())
          )) {
            // Get packages from repository context
            const { latestPackages } = packageStats;
            handlePackagesQuery(latestPackages);
            setIsProcessing(false);
            return;
          }

          // Check for usage instruction requests
          const lowerContent = content.toLowerCase();
          
          // Check for curl instructions
          if (PACKAGE_PATTERNS.usageInstructions.curl.some(pattern => 
            new RegExp(pattern, 'i').test(content)
          )) {
            const { latestPackages } = packageStats;
            const examplePackage = latestPackages && latestPackages.length > 0 ? 
              latestPackages[0] : { name: 'example-package', version: '1.0.0' };
            
            const curlSnippet = getUsageSnippet('curl', examplePackage.name, examplePackage.version);
            
            addBotMessage(`Here's how to use curl to download the ${examplePackage.name} package:\n\n\`\`\`bash\n${curlSnippet}\n\`\`\`\n\nYou'll need to replace $YOUR_API_TOKEN with your actual API token.`);
            setIsProcessing(false);
            return;
          }
          
          // Check for docker instructions
          if (PACKAGE_PATTERNS.usageInstructions.docker.some(pattern => 
            new RegExp(pattern, 'i').test(content)
          )) {
            const { latestPackages } = packageStats;
            const examplePackage = latestPackages && latestPackages.length > 0 ? 
              latestPackages[0] : { name: 'example-package', version: '1.0.0' };
            
            const dockerSnippet = getUsageSnippet('docker', examplePackage.name, examplePackage.version);
            
            // Create message with both code snippet and token creation button
            const message = MessageFactory.createActionOptionsMessage(
              `Here's how to use Docker with the ${examplePackage.name} package:\n\n\`\`\`bash\n${dockerSnippet}\n\`\`\`\n\nThis will first authenticate you with the registry, then pull the image and run it as a container with port 8080 exposed. When logging in, use your access token as the password.`,
              [
                { 
                  id: 'create-docker-token', 
                  label: 'Create a new token', 
                  value: 'Create a new, no-expiry access token called docker-token'
                }
              ]
            );
            
            addBotMessage(message);
            setIsProcessing(false);
            return;
          }
          
          // Check for kubernetes instructions
          if (PACKAGE_PATTERNS.usageInstructions.kubernetes.some(pattern => 
            new RegExp(pattern, 'i').test(content)
          )) {
            const { latestPackages } = packageStats;
            const examplePackage = latestPackages && latestPackages.length > 0 ? 
              latestPackages[0] : { name: 'example-package', version: '1.0.0' };
            
            const k8sSnippet = getUsageSnippet('kubernetes', examplePackage.name, examplePackage.version);
            
            addBotMessage(`Here's a Kubernetes deployment manifest for the ${examplePackage.name} package:\n\n\`\`\`yaml\n${k8sSnippet}\n\`\`\`\n\nSave this to a file named \`${examplePackage.name}-deployment.yaml\` and apply it with \`kubectl apply -f ${examplePackage.name}-deployment.yaml\`.`);
            setIsProcessing(false);
            return;
          }

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
          
          // Check if this is starting a token flow or a direct token generation command
          const directTokenPatterns = [
            // Original patterns
            /^(?:create|generate\s+)?(?:a\s+)?token\s+for\s+(.+?)\s+with\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+with\s+(?:the\s+)?name\s+(.+?)\s+and\s+(?:an?\s+)?(?:expiration\s+of\s+)?(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+named\s+(.+?)\s+(?:with\s+)?(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+(.+?)\s+(?:that\s+)?(?:never\s+expires?|valid\s+forever)(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+(.+?)\s+(?:valid\s+for\s+)?(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            // k8s-deploy patterns
            /^(?:create|generate\s+)?(?:a\s+)?token\s+k8s-deploy\s+(?:valid\s+)?forever(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+k8s-deploy\s+(?:valid\s+for\s+)?(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            // Named with expiration patterns
            /^(?:create|generate\s+)?(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+with\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?(?:\s*$|\s*[\n.])/i,
            /^(?:create|generate\s+)?(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+(?:that\s+)?(?:expires?\s+in\s+)?(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            // Natural language variations with better name capture
            /(?:create|make|generate|get)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+(?:for|valid for|with duration|that lasts)?\s*(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            // More flexible patterns with name capture
            /.*token\s+(\w+[-\w]*)(?:\s+for|\s+valid|\s+with)?\s+(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i,
            /.*token\s+(\w+[-\w]*)\s+(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.])/i
          ];
          
          // Define grammar keywords to exclude
          const grammarKeywords = [
            'a', 'an', 'the', 'for', 'with', 'and', 'or', 'in', 'on', 'at', 'to', 'of',
            'valid', 'name', 'named', 'called', 'token', 'generate', 'create', 'make',
            'that', 'which', 'duration', 'expiration', 'expires', 'days', 'months', 'years',
            'week', 'forever', 'never'
          ];

          // Function to validate token name
          const validateTokenName = (name: string): string | null => {
            if (!name) return null;
            
            // Remove any punctuation and convert to lowercase for checking
            const cleanName = name.toLowerCase().replace(/[^\w\s-]/g, '').trim();
            
            // Check if it's a single word (only contains letters, numbers, hyphen)
            if (!/^[\w-]+$/.test(cleanName)) {
              return null;
            }

            // Check if it's too short (single character)
            if (cleanName.length < 2) {
              return null;
            }

            // Check if it's not a grammar keyword
            if (grammarKeywords.includes(cleanName)) {
              return null;
            }

            return cleanName;
          };

          // Try to match against any of the patterns
          let directTokenMatch = null;
          let tokenDescription = '';
          let tokenDuration = '';
          
          // First try to find a direct token name and duration - most specific patterns first
          const simpleMatch = 
            // Match "Create a new, no-expiry access token called X" format
            content.match(/(?:create\s+(?:a\s+)?new,?\s+)?(?:no-expiry|no\s+expiry)\s+access\s+token\s+called\s+(\w+[-\w]*)/i) ||

            // Match period-separated token name and expiration (flexible punctuation)
            content.match(/(?:also\s+)?(?:create\s+|generate\s+)?(?:a\s+)?token\s+(?:name\s+|named\s+)?(\w+[-\w]*)[\s.,/]*(?:expiration|expires?(?:\s+in)?|valid\s+for)\s+(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.,])/i) ||
            // Match "Create token named X with Y days expiration"
            content.match(/(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+(?:for|with)?\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?/i) ||
            // Match "token name with X time expiration"
            content.match(/(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+with\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?/i) ||
            // Match "token <n> with/for <time>" format
            content.match(/(?:also\s+)?token\s+<(\w+[-\w]*)>\s+(?:with|for)\s+<(\d+\s*(?:days?|months?|years?|week))>/i) ||
            // Match other patterns
            content.match(/(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+(?:for\s+)?(\d+\s*(?:days?|months?|years?|week))/i) ||
            content.match(/(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+forever/i) ||
            // Match "token named X valid forever"
            content.match(/(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+valid\s+forever/i);

          // Debug logging
          console.log("Input content:", content);
          console.log("Simple match result:", simpleMatch);

          if (simpleMatch) {
            console.log("Match groups:", simpleMatch.groups);
            console.log("Match array:", Array.from(simpleMatch));
            const possibleName = validateTokenName(simpleMatch[1]);
            console.log("Possible name:", possibleName);
            if (possibleName) {
              directTokenMatch = simpleMatch;
              tokenDescription = possibleName;
              // Check if this is a no-expiry match (first pattern)
              if (content.toLowerCase().includes('no-expiry') || content.toLowerCase().includes('no expiry')) {
                tokenDuration = 'never';
              } else {
                // Remove angle brackets if they exist in the duration
                tokenDuration = simpleMatch[2] ? simpleMatch[2].trim().replace(/[<>]/g, '') : 'never';
              }
              console.log("Extracted token info:", { name: tokenDescription, duration: tokenDuration });
            }
          }

          // If no simple match, try the more complex patterns
          if (!directTokenMatch) {
            const directTokenPatterns = [
              // Period-separated token name and expiration patterns (flexible punctuation)
              /(?:also\s+)?(?:create\s+|generate\s+)?(?:a\s+)?token\s+(?:name\s+|named\s+)?(\w+[-\w]*)[\s.,/]*(?:expiration|expires?(?:\s+in)?|valid\s+for)\s+(\d+\s*(?:days?|months?|years?|week))(?:\s*$|\s*[\n.,])/i,
              /(?:also\s+)?(?:create\s+|generate\s+)?(?:a\s+)?token\s+(?:name\s+|named\s+)?(\w+[-\w]*)[\s.,/]*(?:expiration|expires?(?:\s+in)?|valid\s+for)\s+forever(?:\s*$|\s*[\n.,])/i,
              // Named with expiration patterns - most specific first
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+(?:for|with)?\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?/i,
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+named\s+(\w+[-\w]*)\s+(?:that\s+)?(?:expires?\s+in\s+)?(\d+\s*(?:days?|months?|years?|week))/i,
              // Simple format
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+with\s+(\d+\s*(?:days?|months?|years?|week))(?:\s+expiration)?/i,
              // Angle bracket format
              /(?:also\s+)?token\s+<(\w+[-\w]*)>\s+(?:with|for)\s+<(\d+\s*(?:days?|months?|years?|week))>/i,
              // Other patterns
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+(?:for|valid for|with duration|that lasts)?\s*(\d+\s*(?:days?|months?|years?|week))/i,
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+(?:valid\s+for\s+)?(\d+\s*(?:days?|months?|years?|week))/i,
              // Forever patterns
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+(\w+[-\w]*)\s+(?:that\s+)?(?:never\s+expires?|valid\s+forever)/i,
              // k8s-deploy patterns
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+k8s-deploy\s+(?:valid\s+)?forever/i,
              /(?:also\s+)?(?:create|generate)?\s*(?:a\s+)?token\s+k8s-deploy\s+(?:valid\s+for\s+)?(\d+\s*(?:days?|months?|years?|week))/i
            ];

            for (const pattern of directTokenPatterns) {
              const match = content.match(pattern);
              console.log("Trying pattern:", pattern);
              console.log("Match result:", match);
              if (match) {
                const possibleName = match[1] ? validateTokenName(match[1]) : null;
                if (possibleName) {
                  directTokenMatch = match;
                  tokenDescription = possibleName;
                  // Check if this is a "forever" pattern
                  if (pattern.toString().includes('forever') || pattern.toString().includes('never')) {
                    tokenDuration = 'never';
                  } else {
                    tokenDuration = match[2] ? match[2].trim() : 'never';
                  }
                  console.log("Pattern matched. Token info:", { name: tokenDescription, duration: tokenDuration });
                  break;
                }
              }
            }
          }
          
          // Direct token generation pattern matched
          if (directTokenMatch) {
            // Final validation
            if (!tokenDescription || tokenDescription.length < 2) {
              addBotMessage("The token name must be at least 2 characters long and cannot be a common word like 'for', 'with', etc. Please try again with a valid name.");
              setIsProcessing(false);
              return;
            }

            console.log("Token generation proceeding with:", { name: tokenDescription, duration: tokenDuration });
            
            // Normalize duration for easier matching
            let normalizedDuration = tokenDuration.toLowerCase().trim().replace(/[\n.]$/, '');
            
            // Validate duration
            const validDurations = [
              'never', 'no expiration', 'no expire', 'unlimited', 'no-expiry',
              '1 day', 'one day', '1day', 'a day', 
              '3 days', 'three days', '3days',
              '7 days', 'seven days', '7days', 'a week', 'one week',
              '1 month', 'one month', '1month', '30 days', 'a month',
              '1 year', 'one year', '1year', '365 days', 'a year'
            ];
            
            // Check for custom duration (e.g., "70 days", "3 months", "7 years")
            const customDaysMatch = normalizedDuration.match(/^(\d+)\s*days?$/i);
            const customMonthsMatch = normalizedDuration.match(/^(\d+)\s*months?$/i);
            const customYearsMatch = normalizedDuration.match(/^(\d+)\s*years?$/i);
            
            if (customDaysMatch) {
              const days = parseInt(customDaysMatch[1]);
              if (days > 0) {
                normalizedDuration = `${days} days`;
              }
            } else if (customMonthsMatch) {
              const months = parseInt(customMonthsMatch[1]);
              if (months > 0) {
                normalizedDuration = `${months} months`;
              }
            } else if (customYearsMatch) {
              const years = parseInt(customYearsMatch[1]);
              if (years > 0) {
                normalizedDuration = `${years} years`;
              }
            } else {
              // Remove any trailing period before checking standard formats
              const durationWithoutPeriod = normalizedDuration.replace(/\.$/, '');
              
              // Map to standard format
              if (['no expiration', 'no expire', 'unlimited', 'no-expiry'].includes(durationWithoutPeriod)) {
                normalizedDuration = 'never';
              } else if (['one day', '1day', 'a day'].includes(durationWithoutPeriod)) {
                normalizedDuration = '1 day';
              } else if (['three days', '3days'].includes(durationWithoutPeriod)) {
                normalizedDuration = '3 days';
              } else if (['seven days', '7days', 'a week', 'one week'].includes(durationWithoutPeriod)) {
                normalizedDuration = '7 days';
              } else if (['one month', '1month', '30 days', 'a month'].includes(durationWithoutPeriod)) {
                normalizedDuration = '1 month';
              } else if (['one year', '1year', '365 days', 'a year'].includes(durationWithoutPeriod)) {
                normalizedDuration = '1 year';
              }
            }
            
            // Check if the duration is valid (either a custom format or one of the standard durations)
            const durationWithoutPeriod = normalizedDuration.replace(/\.$/, '');
            if (!customDaysMatch && !customMonthsMatch && !customYearsMatch && !validDurations.includes(durationWithoutPeriod)) {
              // Invalid duration
              addBotMessage(`The duration "${tokenDuration}" is not valid. Please specify a number of days, months, or years (e.g., "70 days", "3 months", or "2 years") or choose from: Never, 1 Day, 3 Days, 7 Days, 1 Month, or 1 Year.`);
              setIsProcessing(false);
              return;
            }
            
            // Store token info in state for later use
            setTokenFlowState({
              step: 'confirmation',
              tokenName: tokenDescription,
              tokenExpiration: normalizedDuration,
              isExternal: content.toLowerCase().includes('external') || content.toLowerCase().includes('external only')
            });
            
            // Show confirmation message
            const message = MessageFactory.createActionOptionsMessage(
              `Got it! Here's a quick summary:

Name: ${tokenDescription}
Type: ${content.toLowerCase().includes('external') || content.toLowerCase().includes('external only') ? 'external access' : 'internal access'}

Expiry: ${normalizedDuration === 'never' ? 'never' : normalizedDuration}

Would you like me to generate the token now?`,
              [
                { id: 'confirm-yes', label: 'Yes', value: 'Yes' },
                { id: 'confirm-no', label: 'No', value: 'No' }
              ]
            );
            
            addBotMessage(message);
            setIsProcessing(false);
            return;
          }
          // Regular token request without the specific format
          else if (content.toLowerCase().includes('token') || 
              content.toLowerCase().includes('generate token') || 
              content.includes('create token')) {
            
            console.log("Token request detected, showing instructions");
            
            // Show token generation instructions
            addBotMessage(`🔐 To generate a token, please provide:

1. A descriptive name for the token
2. The expiration period (e.g., "7 days", "1 month", "never")
3. Whether it's for external access (optional)

For example:
"Create a token named deploy-token with 30 days expiration"
or
"Generate an external token named client-access valid for 1 year"`);
            
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

  const handlePackagesQuery = (latestPackages: unknown[]) => {
    if (!latestPackages || !Array.isArray(latestPackages) || latestPackages.length === 0) {
      addBotMessage("Sorry, I couldn't find any recent packages.");
      return;
    }

    // Format packages for display
    const formattedPackages = latestPackages.slice(0, 5).map((rawPkg: unknown, index: number) => {
      const pkg = rawPkg as Record<string, unknown>;
      return {
        type: (pkg.type as string) || 'unknown',
        name: pkg.name as string,
        version: pkg.version as string,
        firstCreated: formatDistanceToNow(new Date(pkg.releaseDate as string), { addSuffix: true }),
        versions: pkg.type === 'docker' ? [3, 5, 8][index % 3] : [1, 2, 4, 7][index % 4],
        externalDistributed: pkg.status === 'passed' ? 'Yes' as const : 'No' as const
      };
    });

    // Create a package table message with follow-up options
    const message = MessageFactory.createPackageTableMessage(
      "Here are the latest 5 packages published in your organization:",
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

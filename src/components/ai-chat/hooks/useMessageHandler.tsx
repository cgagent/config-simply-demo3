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
 * - This hook should NOT handle direct API calls to external services
 * - It should NOT manage authentication or user data
 * - It should NOT handle routing or navigation
 * - It should NOT directly render UI components
 * - Complex business logic should be delegated to appropriate services
 * 
 * This hook acts as a coordinator between UI components and business logic services.
 */
import { useToast } from '@/hooks/use-toast';
import { useMessageState } from './useMessageState';
import { ChatOption } from '@/components/shared/types';
import { generateSecurityRemediationResponse } from '../config/responses/securityResponses';
import { Repository } from '../config/patterns/ciPatterns';
import { isConfirmationMessage } from '../config/patterns/confirmationPatterns';
import { getRandomResponse, getCurrentActionOptions, simulateAIResponse, getCurrentFlow, getCurrentStep } from '../utils/aiResponseUtils';
import { useState } from 'react';
import { MessageFactory } from '../utils/messageFactory';
import { conversationFlows } from '../config/flows';


export const useMessageHandler = () => {
  const { toast } = useToast();
  const [showCIConfig, setShowCIConfig] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  
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
  const handleSecurityRemediation = handleActionSelection;

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
          // Add debug logging for current flow and step
          console.log("Before processing - Current flow and step:", {
            currentFlow: getCurrentFlow(),
            currentStep: getCurrentStep()
          });
          
          // Get the AI response using the existing utility
          const aiResponse = getRandomResponse(content);
          console.log("AI response:", aiResponse);
          
          // Add debug logging for current flow and step after processing
          console.log("After processing - Current flow and step:", {
            currentFlow: getCurrentFlow(),
            currentStep: getCurrentStep()
          });
          
          // Check if there are action options for this response
          const actionOptions = getCurrentActionOptions();
          
          // Check if this is a confirmation message using the configuration
          const isConfirmation = isConfirmationMessage(content);
          
          // Create and add the appropriate response message
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
    setShowCIConfig(false);
    setRepository(null);
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

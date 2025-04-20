/**
 * AI Response Utilities
 * 
 * This module provides utilities for simulating AI responses in the chat interface.
 * It manages conversation flows, tracks state, and generates appropriate responses
 * based on user input.
 * 
 * SCOPE:
 * - Simulating AI responses based on predefined conversation flows
 * - Managing conversation state (current flow, step, action options)
 * - Providing helper functions to access conversation state
 * 
 * BOUNDARIES:
 * - This module should NOT handle UI rendering or state management
 * - It should NOT directly interact with external APIs or services
 * - It should NOT manage authentication or user data
 * - It should NOT handle routing or navigation
 * 
 * The actual AI integration should be handled by a separate service layer.
 * This module is specifically for simulation and testing purposes.
 */

import { conversationFlows } from '../config/flows';
import { standaloneResponses } from '../config/responses/standaloneResponses';
import { ChatOption } from '@/components/shared/types';

// Track conversation state
let currentFlow: string | null = null;
let currentStep: string | null = null;

// Track action options for specific flows
let currentActionOptions: ChatOption[] | null = null;

/**
 * Simulate AI response using structured conversation flows and responses
 */
export const simulateAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase().trim();

  // Add debug logging
  console.log("Query evaluation:", {
    query: lowerQuery,
    currentFlow,
    currentStep
  });

  // First, check if we're in a conversation flow
  if (currentFlow) {
    const flow = conversationFlows.find(f => f.id === currentFlow);
    if (flow) {
      const currentStepData = flow.steps.find(s => s.id === currentStep);
      if (currentStepData) {
        // Check if the query matches any patterns for the current step
        const matchingPattern = currentStepData.patterns.find(pattern => 
          lowerQuery.includes(pattern)
        );

        // Check if this is an action selection
        const isActionSelection = currentActionOptions && 
          currentActionOptions.some(option => 
            option.value.toLowerCase() === lowerQuery || 
            option.id.toLowerCase() === lowerQuery
          );

        // If there's a matching pattern or this is an action selection, proceed
        if (matchingPattern || isActionSelection) {
          // Check if this is the end of the flow
          if (currentStepData.isEndOfFlow) {
            // End the flow and return the final response
            currentFlow = null;
            currentStep = null;
            currentActionOptions = null;
            return typeof currentStepData.response === 'function' 
              ? currentStepData.response(lowerQuery)
              : currentStepData.response;
          }

          // If there are next steps, update the current step
          if (currentStepData.nextSteps && currentStepData.nextSteps.length > 0) {
            currentStep = currentStepData.nextSteps[0];
            
            // Set action options for the next step if available
            const nextStepData = flow.steps.find(s => s.id === currentStep);
            if (nextStepData && nextStepData.actionOptions) {
              currentActionOptions = nextStepData.actionOptions;
            } else {
              currentActionOptions = null;
            }
          } else {
            // End of flow - no next steps
            currentFlow = null;
            currentStep = null;
            currentActionOptions = null;
          }

          // Return the response, handling both string and function responses
          return typeof currentStepData.response === 'function' 
            ? currentStepData.response(lowerQuery)
            : currentStepData.response;
        }
      }
    }
  }

  // If not in a flow or no match in current flow, check for new flow starts
  for (const flow of conversationFlows) {
    const initialStep = flow.steps[0];
    if (initialStep.patterns.some(pattern => lowerQuery.includes(pattern))) {
      currentFlow = flow.id;
      currentStep = initialStep.id;
      
      // Set action options for the initial step if available
      if (initialStep.actionOptions) {
        currentActionOptions = initialStep.actionOptions;
      } else {
        currentActionOptions = null;
      }
      
      return typeof initialStep.response === 'function'
        ? initialStep.response(lowerQuery)
        : initialStep.response;
    }
  }

  // Check standalone responses, prioritizing longer patterns first
  const sortedResponses = [...standaloneResponses].sort((a, b) => {
    // Get the longest pattern for each response
    const aMaxLength = Math.max(...a.patterns.map(p => p.length));
    const bMaxLength = Math.max(...b.patterns.map(p => p.length));
    return bMaxLength - aMaxLength;
  });

  for (const response of sortedResponses) {
    // For each response, check if any of its patterns are contained in the query
    // and if the query contains the pattern as a whole word
    const matchingPattern = response.patterns.find(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return regex.test(lowerQuery);
    });

    if (matchingPattern) {
      return typeof response.response === 'function'
        ? response.response(lowerQuery)
        : response.response;
    }
  }

  // Default response if no matches found
  return "I understand you're asking about \"" + query + "\". Let me provide some information about that. This is a simulated response in our demo application. In a production environment, this would connect to an AI language model API like OpenAI GPT, Anthropic Claude, or Perplexity to provide helpful and accurate responses.";
};

// Helper function to get a simulated response
export const getRandomResponse = (query: string): string => {
  return simulateAIResponse(query);
};

// Helper function to get current action options
export const getCurrentActionOptions = () => {
  return currentActionOptions;
};

// Helper function to get current flow
export const getCurrentFlow = () => {
  return currentFlow;
};

// Helper function to get current step
export const getCurrentStep = () => {
  return currentStep;
};

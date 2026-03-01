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
 * ⚠️ IMPORTANT: This file should NOT contain business logic! ⚠️
 * Business logic should be added to the appropriate config files:
 * - New response patterns → /config/patterns/
 * - New conversation flows → /config/flows/
 * - New response templates → /config/responses/
 * 
 * This file should NOT:
 * - Handle UI rendering or state management
 * - Directly interact with external APIs or services
 * - Manage authentication or user data
 * - Handle routing or navigation
 * - Contain response templates or pattern matching logic
 * 
 * The actual AI integration should be handled by a separate service layer.
 * This module is specifically for simulation and testing purposes.
 */

import { conversationFlows } from '../config/flows';
import { standaloneResponses } from '../config/responses/standaloneResponses';
import { ChatOption } from '@/components/shared/types';
import { SECURITY_RISK_PATTERNS } from '../config/patterns/securityPatterns';
import { PACKAGE_PATTERNS } from '../config/patterns/packagePatterns';
import { DISTRIBUTION_PATTERNS } from '../config/patterns/distributionPatterns';
import { packageResponses } from '../config/responses/packageResponses';
import { PACKAGE_FLOW_ID } from '../config/flows/packageFlow';
import { TOKEN_FLOW_ID } from '../config/flows/tokenFlow';
import { DISTRIBUTION_FLOW_ID } from '../config/flows/distributionFlow';
import { Message as BaseMessage } from '../types/messageTypes';

// Add priority pattern matching
const PRIORITY_PATTERNS: Record<string, string[]> = {
  'token-generator': [
    'generate token',
    'create token',
    'new token',
    'token',
    'generate token for',
    'access token'
  ],
  'invite-user': [
    'invite a user',
    'invite user',
    'add a user',
    'add user',
    'invite as developer',
    'invite as admin'
  ],
  'repo-configure-simply': [
    'simple config',
    'quick setup',
    'configure simply',
    'easy setup', 
    'repo config',
    'repository config',
    'quick configure',
    'simple repository',
    'configure repository',
    'configure repo',
    'set up repository',
    'set up repo'
  ],
  [DISTRIBUTION_FLOW_ID]: [
    'external distribution',
    'externally distribute',
    'distribute package',
    'distribute build',
    'distribute outside',
    'package to users outside',
    'need to externally distribute'
  ]
  // Add more flows as needed
};

// Global repository context data
// This will be populated by the setRepositoryData function
let repositoryData = {
  latestPackages: []
};

// Track conversation state
let currentFlow: string | null = null;
let currentStep: string | null = null;

// Track action options for specific flows
let currentActionOptions: ChatOption[] | null = null;

// Function to set repository data from outside this module
export const setRepositoryData = (data: unknown) => {
  repositoryData = data;
};

/**
 * Simulate AI response using structured conversation flows and responses
 */
export const simulateAIResponse = (query: string): string | BaseMessage => {
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
        const matchingPattern = currentStepData.patterns.some(pattern => {
          // Normalize both the query and pattern
          const normalizedQuery = lowerQuery.replace(/[?!.,]/g, '').trim();
          const normalizedPattern = pattern.toLowerCase().replace(/[?!.,]/g, '').trim();
          return normalizedQuery.includes(normalizedPattern);
        });

        // Check if this is an action selection
        const isActionSelection = currentActionOptions && 
          currentActionOptions.some(option => 
            option.value.toLowerCase() === lowerQuery || 
            option.id.toLowerCase() === lowerQuery
          );
          
        // Check if the query matches patterns in the next step (for transitions like confirmations)
        let matchesNextStepPattern = false;
        if (currentStepData.nextSteps && currentStepData.nextSteps.length > 0) {
          const nextStepId = currentStepData.nextSteps[0];
          const nextStepData = flow.steps.find(s => s.id === nextStepId);
          if (nextStepData) {
            matchesNextStepPattern = nextStepData.patterns.some(pattern => 
              lowerQuery.includes(pattern)
            );
          }
        }

        // If there's a matching pattern or this is an action selection or matches next step pattern, proceed
        if (matchingPattern || isActionSelection || matchesNextStepPattern) {
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

  // Before checking all flows, check priority patterns for exact matches
  // This ensures the correct flow is triggered for specific commands
  for (const [flowId, patterns] of Object.entries(PRIORITY_PATTERNS)) {
    // Find the flow by ID
    const flow = conversationFlows.find(f => f.id === flowId);
    if (flow) {
      // Check for both exact matches and if the query contains the pattern
      const exactMatch = patterns.some(pattern => {
        // Normalize both the query and pattern
        const normalizedQuery = lowerQuery.replace(/[?!.,]/g, '').trim();
        const normalizedPattern = pattern.toLowerCase().replace(/[?!.,]/g, '').trim();
        return normalizedQuery === normalizedPattern || 
               normalizedQuery.includes(normalizedPattern) ||
               // Special case for our distribution query
               (flowId === DISTRIBUTION_FLOW_ID && 
                normalizedQuery.includes('externally distribute') && 
                normalizedQuery.includes('package') && 
                normalizedQuery.includes('outside'));
      });
      
      if (exactMatch) {
        const initialStep = flow.steps[0];
        currentFlow = flow.id;
        currentStep = initialStep.id;
        
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
  }

  // If not in a flow or no priority match, check for new flow starts
  for (const flow of conversationFlows) {
    const initialStep = flow.steps[0];
    if (initialStep.patterns.some(pattern => {
      // Normalize both the query and pattern by:
      // 1. Converting to lowercase
      // 2. Removing punctuation (?, ., !, etc.)
      // 3. Trimming whitespace
      const normalizedQuery = lowerQuery.replace(/[?!.,]/g, '').trim();
      const normalizedPattern = pattern.toLowerCase().replace(/[?!.,]/g, '').trim();
      return normalizedQuery.includes(normalizedPattern);
    })) {
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
      // Normalize both the query and pattern
      const normalizedQuery = lowerQuery.replace(/[?!.,]/g, '').trim();
      const normalizedPattern = pattern.toLowerCase().replace(/[?!.,]/g, '').trim();
      const regex = new RegExp(`\\b${normalizedPattern}\\b`, 'i');
      return regex.test(normalizedQuery);
    });

    if (matchingPattern) {
      return typeof response.response === 'function'
        ? response.response(lowerQuery)
        : response.response;
    }
  }

  // Default response if no matches found
  return "I understand you're asking about \"" + query + "\". Let me provide some information about that. This is a simulated response in our demo application. In a production environment, this would connect to an AI language model API to provide helpful and accurate responses.";
};

// Helper function to get a simulated response
export const getRandomResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // First check if this is a token generation request
  if (lowerQuery.includes('token') || 
      lowerQuery.includes('generate token') || 
      lowerQuery.includes('create token')) {
    console.log("Token generation request detected, letting flow handle it");
    
    // Check if we're already in the token flow
    if (currentFlow === TOKEN_FLOW_ID) {
      console.log("Already in token flow, current step:", currentStep);
      // Let the flow handle advancement through the steps
      // Return empty string to signal that flow should handle it
      return "";
    }
    
    // Initialize the token flow if not already in it
    const tokenFlow = conversationFlows.find(f => f.id === TOKEN_FLOW_ID);
    if (tokenFlow) {
      console.log("Starting token flow");
      // Set initial state for token flow
      currentFlow = TOKEN_FLOW_ID;
      currentStep = tokenFlow.steps[0].id;
      if (tokenFlow.steps[0].actionOptions) {
        currentActionOptions = tokenFlow.steps[0].actionOptions;
      }
      // Return the initial response from the flow
      return typeof tokenFlow.steps[0].response === 'function'
        ? tokenFlow.steps[0].response(query)
        : tokenFlow.steps[0].response;
    }
    
    // Return empty string to let the flow take over
    return "";
  }
  
  // Handle package flow special cases
  if (currentFlow === PACKAGE_FLOW_ID) {
    const step = currentStep || '';
    
    if (step === 'latest-packages' || 
        PACKAGE_PATTERNS.latestPackages.some(pattern => lowerQuery.includes(pattern.toLowerCase()))) {
      // Debug logging for repository data
      console.log("Repository data for package response:", JSON.stringify(repositoryData, null, 2));
      console.log("Latest packages being sent to response generator:", 
        repositoryData.latestPackages ? 
          JSON.stringify(repositoryData.latestPackages, null, 2) : 
          "No packages found");
      
      // Use the package responses to generate a response with the latest packages
      return packageResponses.latestPackages(repositoryData.latestPackages, query);
    }
  }
  
  // For all other cases, use the standard response simulation
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

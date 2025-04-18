/**
 * Represents a single step in a conversation flow
 */
export interface ConversationStep {
  /** Unique identifier for the step */
  id: string;
  /** Array of patterns that trigger this step */
  patterns: string[];
  /** The response content for this step */
  response: string | ((input: string) => string);
  /** Optional array of next step IDs in the conversation flow */
  nextSteps?: string[];
}

/**
 * Represents a complete conversation flow with multiple steps
 */
export interface ConversationFlow {
  /** Unique identifier for the flow */
  id: string;
  /** Display name for the flow */
  name: string;
  /** Array of steps in the conversation flow */
  steps: ConversationStep[];
} 
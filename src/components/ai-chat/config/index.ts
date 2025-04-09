import { conversationFlows } from './flows';
import { patterns } from './patterns';
import { responses } from './responses';

/**
 * Main configuration for the AI chat
 */
export const config = {
  patterns,
  responses,
  flows: conversationFlows
}; 
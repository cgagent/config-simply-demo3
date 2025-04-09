import { ChatOption } from '../../ai-configuration/types';

/**
 * Represents the different types of messages that can be displayed in the chat
 */
export type MessageType = 
  | 'text' 
  | 'security-alert' 
  | 'package-info' 
  | 'ci-config' 
  | 'action-options';

/**
 * Base interface for all message types
 */
export interface BaseMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: MessageType;
  timestamp: number;
}

/**
 * Interface for security alert messages with CVE data
 */
export interface SecurityAlertMessage extends BaseMessage {
  type: 'security-alert';
  cveData: {
    cveId: string;
    description: string;
    severity: string;
    packageName: string;
    packageVersion: string;
    fixVersion: string;
    cveRelation: string;
    cvssScore: string;
    epssScore: string;
    percentile: string;
  };
  remediationOptions: ChatOption[];
}

/**
 * Interface for package information messages
 */
export interface PackageInfoMessage extends BaseMessage {
  type: 'package-info';
  packageData: {
    name: string;
    version: string;
    latestVersion: string;
    description: string;
    license: string;
    dependencies?: Record<string, string>;
  };
}

/**
 * Interface for CI configuration messages
 */
export interface CIConfigMessage extends BaseMessage {
  type: 'ci-config';
  configData: {
    tool: string;
    packageManager: 'npm' | 'maven' | 'both';
    configExample?: string;
  };
}

/**
 * Interface for action option messages
 */
export interface ActionOptionsMessage extends BaseMessage {
  type: 'action-options';
  options: ChatOption[];
}

/**
 * Union type of all possible message types
 */
export type Message = 
  | BaseMessage 
  | SecurityAlertMessage 
  | PackageInfoMessage 
  | CIConfigMessage 
  | ActionOptionsMessage;

/**
 * Type guard to check if a message is a security alert
 */
export function isSecurityAlertMessage(message: Message): message is SecurityAlertMessage {
  return message.type === 'security-alert';
}

/**
 * Type guard to check if a message is a package info message
 */
export function isPackageInfoMessage(message: Message): message is PackageInfoMessage {
  return message.type === 'package-info';
}

/**
 * Type guard to check if a message is a CI config message
 */
export function isCIConfigMessage(message: Message): message is CIConfigMessage {
  return message.type === 'ci-config';
}

/**
 * Type guard to check if a message is an action options message
 */
export function isActionOptionsMessage(message: Message): message is ActionOptionsMessage {
  return message.type === 'action-options';
} 
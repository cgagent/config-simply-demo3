import { v4 as uuidv4 } from 'uuid';
import { 
  BaseMessage, 
  SecurityAlertMessage, 
  PackageInfoMessage, 
  CIConfigMessage, 
  ActionOptionsMessage,
  PackageTableMessage,
  Message
} from '../types/messageTypes';
import { ChatOption } from '@/components/shared/types';
import { 
  ParsedContent, 
  SecurityAlertParsedContent, 
  PackageInfoParsedContent, 
  CIConfigParsedContent, 
  ActionOptionsParsedContent 
} from '../types/parsedContentTypes';

/**
 * Type guard to check if parsed content is a security alert
 */
function isSecurityAlertParsedContent(content: ParsedContent): content is SecurityAlertParsedContent {
  return content.type === 'security-alert';
}

/**
 * Type guard to check if parsed content is a package info
 */
function isPackageInfoParsedContent(content: ParsedContent): content is PackageInfoParsedContent {
  return content.type === 'package-info';
}

/**
 * Type guard to check if parsed content is a CI config
 */
function isCIConfigParsedContent(content: ParsedContent): content is CIConfigParsedContent {
  return content.type === 'ci-config';
}

/**
 * Type guard to check if parsed content is an action options
 */
function isActionOptionsParsedContent(content: ParsedContent): content is ActionOptionsParsedContent {
  return content.type === 'action-options';
}

/**
 * Factory class for creating different types of messages
 */
export class MessageFactory {
  /**
   * Creates a basic text message
   */
  static createTextMessage(content: string, role: 'user' | 'assistant'): BaseMessage {
    return {
      id: uuidv4(),
      role,
      content,
      type: 'text',
      timestamp: Date.now()
    };
  }
  
  /**
   * Creates a security alert message with CVE data
   */
  static createSecurityAlertMessage(
    content: string, 
    cveData: SecurityAlertMessage['cveData'],
    remediationOptions: ChatOption[]
  ): SecurityAlertMessage {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      type: 'security-alert',
      timestamp: Date.now(),
      cveData,
      remediationOptions
    };
  }
  
  /**
   * Creates a package information message
   */
  static createPackageInfoMessage(
    content: string,
    packageData: PackageInfoMessage['packageData']
  ): PackageInfoMessage {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      type: 'package-info',
      timestamp: Date.now(),
      packageData
    };
  }
  
  /**
   * Creates a CI configuration message
   */
  static createCIConfigMessage(
    content: string,
    configData: CIConfigMessage['configData']
  ): CIConfigMessage {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      type: 'ci-config',
      timestamp: Date.now(),
      configData
    };
  }
  
  /**
   * Creates an action options message
   */
  static createActionOptionsMessage(
    content: string,
    options: ChatOption[]
  ): ActionOptionsMessage {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      type: 'action-options',
      timestamp: Date.now(),
      options
    };
  }
  
  /**
   * Creates a package table message
   */
  static createPackageTableMessage(
    content: string,
    packages: {
      type: string;
      name: string;
      version: string;
      firstCreated: string;
      versions: number;
    }[],
    options?: ChatOption[]
  ): PackageTableMessage {
    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      type: 'package-table',
      timestamp: Date.now(),
      packages,
      options
    };
  }
  
  /**
   * Creates a message from a parsed content object
   * This is a helper method to create the appropriate message type based on parsed content
   */
  static createFromParsedContent(
    parsedContent: ParsedContent,
    role: 'user' | 'assistant' = 'assistant'
  ): Message {
    if (isSecurityAlertParsedContent(parsedContent)) {
      return this.createSecurityAlertMessage(
        parsedContent.content,
        parsedContent.cveData,
        parsedContent.remediationOptions
      );
    }
    
    if (isPackageInfoParsedContent(parsedContent)) {
      return this.createPackageInfoMessage(
        parsedContent.content,
        parsedContent.packageData
      );
    }
    
    if (isCIConfigParsedContent(parsedContent)) {
      return this.createCIConfigMessage(
        parsedContent.content,
        parsedContent.configData
      );
    }
    
    if (isActionOptionsParsedContent(parsedContent)) {
      return this.createActionOptionsMessage(
        parsedContent.content,
        parsedContent.options
      );
    }
    
    // Default to text message
    return this.createTextMessage(parsedContent.content, role);
  }
} 
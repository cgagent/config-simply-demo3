import { ChatOption } from '../../ai-configuration/types';
import { MessageType } from './messageTypes';

/**
 * Base interface for all parsed content types
 */
export interface BaseParsedContent {
  type: MessageType;
  content: string;
}

/**
 * Interface for parsed security alert content
 */
export interface SecurityAlertParsedContent extends BaseParsedContent {
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
 * Interface for parsed package info content
 */
export interface PackageInfoParsedContent extends BaseParsedContent {
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
 * Interface for parsed CI config content
 */
export interface CIConfigParsedContent extends BaseParsedContent {
  type: 'ci-config';
  configData: {
    tool: string;
    packageManager: 'npm' | 'maven' | 'both';
    configExample?: string;
  };
}

/**
 * Interface for parsed action options content
 */
export interface ActionOptionsParsedContent extends BaseParsedContent {
  type: 'action-options';
  options: ChatOption[];
}

/**
 * Union type of all possible parsed content types
 */
export type ParsedContent = 
  | BaseParsedContent 
  | SecurityAlertParsedContent 
  | PackageInfoParsedContent 
  | CIConfigParsedContent 
  | ActionOptionsParsedContent; 
import { ParsedContent, SecurityAlertParsedContent } from '../types/parsedContentTypes';
import { ChatOption } from '../../ai-configuration/types';

/**
 * Extracts CVE data from a security alert message
 */
const extractCVEData = (content: string): SecurityAlertParsedContent['cveData'] | null => {
  // Check if the content contains CVE information
  if (!content.includes("One package with risks was detected")) {
    return null;
  }

  // Extract CVE ID
  const cveIdMatch = content.match(/CVE-\d{4}-\d+/);
  const cveId = cveIdMatch ? cveIdMatch[0] : "CVE-2024-39338"; // Default for demo

  // Extract package information
  const packageMatch = content.match(/📦\s+(\w+)/);
  const packageName = packageMatch ? packageMatch[1] : "axios"; // Default for demo

  // Extract version information
  const versionMatch = content.match(/Used version:\s+([\d.]+)/);
  const packageVersion = versionMatch ? versionMatch[1] : "1.5.1"; // Default for demo

  // Extract fix version
  const fixVersionMatch = content.match(/Latest version published:\s+([\d.]+)/);
  const fixVersion = fixVersionMatch ? fixVersionMatch[1] : "1.7.4"; // Default for demo

  // Extract severity
  const severityMatch = content.match(/Severity:\s+(\w+)/);
  const severity = severityMatch ? severityMatch[1] : "Critical"; // Default for demo

  // Extract description
  const descriptionMatch = content.match(/Vulnerability description:\s+(.+?)(?:\n|$)/);
  const description = descriptionMatch 
    ? descriptionMatch[1] 
    : "This CVE is enriched by JFrog Research and provides more accurate information"; // Default for demo

  return {
    cveId,
    description,
    severity,
    packageName,
    packageVersion,
    fixVersion,
    cveRelation: "Non-Transitive",
    cvssScore: "7.5 (v3)",
    epssScore: "0.09%",
    percentile: "22.52%"
  };
};

/**
 * Extracts remediation options from a security alert message
 */
const extractRemediationOptions = (): ChatOption[] => {
  return [
    { id: 'git', label: 'Create Git Issue', value: 'I want to create a Git issue for this vulnerability' },
    { id: 'slack', label: 'Notify in Slack', value: 'I want to notify in Slack about this vulnerability' },
    { id: 'email', label: 'Send Email', value: 'I want to send an email about this vulnerability' }
  ];
};

/**
 * Parses message content to extract structured data
 */
export const parseMessageContent = (content: string): ParsedContent => {
  // Check for security alert content
  const cveData = extractCVEData(content);
  if (cveData) {
    return {
      type: 'security-alert',
      content,
      cveData,
      remediationOptions: extractRemediationOptions()
    };
  }

  // Check for package info content
  if (content.includes("📦 **")) {
    // Extract package information
    const packageMatch = content.match(/📦 \*\*(\w+)\*\*/);
    const packageName = packageMatch ? packageMatch[1] : "";
    
    const versionMatch = content.match(/Latest version:\s+([\d.]+)/);
    const latestVersion = versionMatch ? versionMatch[1] : "";
    
    const descriptionMatch = content.match(/• Description:\s+(.+?)(?:\n|$)/);
    const description = descriptionMatch ? descriptionMatch[1] : "";
    
    return {
      type: 'package-info',
      content,
      packageData: {
        name: packageName,
        version: "current",
        latestVersion,
        description,
        license: "MIT"
      }
    };
  }

  // Check for CI config content
  if (content.includes("set up your CI") || content.includes("configure CI")) {
    return {
      type: 'ci-config',
      content,
      configData: {
        tool: "unknown",
        packageManager: "both"
      }
    };
  }

  // Check for action options content
  if (content.includes("Would you like to") || content.includes("Do you want to")) {
    return {
      type: 'action-options',
      content,
      options: [
        { id: 'yes', label: 'Yes', value: 'Yes, I would like to proceed' },
        { id: 'no', label: 'No', value: 'No, thank you' }
      ]
    };
  }

  // Default to text content
  return {
    type: 'text',
    content
  };
}; 
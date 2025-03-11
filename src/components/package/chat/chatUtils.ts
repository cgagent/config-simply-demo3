
import { Package } from '@/types/package';
import { formatNumber, formatBytes } from '@/lib/formatters';
import { Message } from './ChatMessage';

export const processUserQuery = (
  query: string, 
  packages: Package[]
): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('latest') && lowerQuery.includes('download')) {
    return getTopDownloadedPackages(packages);
  } 
  else if (lowerQuery.includes('vulnerabilit')) {
    return getVulnerablePackages(packages);
  }
  else if (lowerQuery.includes('blocked')) {
    return getBlockedPackages(packages);
  }
  else if (lowerQuery.includes('size') || lowerQuery.includes('storage')) {
    return getLargestPackages(packages);
  }
  else if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
    return getPackageSummary(packages);
  }
  else {
    return getGenericResponse(query);
  }
};

export const getInitialMessage = (): Message => {
  return {
    id: '1',
    role: 'bot',
    content: 'Hi! I\'m your package management assistant. How can I help you today? You can ask me about your packages, such as "Show me the latest 10 downloaded packages" or "Show me packages with vulnerabilities".'
  };
};

export const DEFAULT_SUGGESTED_QUERIES = [
  "Show me the latest 10 downloaded packages",
  "Show me existing packages with vulnerabilities",
  "Show me the packages that are blocked",
  "Show me the largest packages by size",
  "Give me a summary of my packages"
];

function getTopDownloadedPackages(packages: Package[]): string {
  const sortedPackages = [...packages]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10);
  
  let response = `Here are the 10 most downloaded packages:\n\n`;
  sortedPackages.forEach((pkg, index) => {
    response += `${index + 1}. **${pkg.name}** (${pkg.type}) - ${formatNumber(pkg.downloads)} downloads\n`;
  });
  
  return response;
}

function getVulnerablePackages(packages: Package[]): string {
  const vulnerablePackages = packages.filter(pkg => pkg.vulnerabilities > 0)
    .sort((a, b) => b.vulnerabilities - a.vulnerabilities);
  
  if (vulnerablePackages.length === 0) {
    return 'Great news! I couldn\'t find any packages with vulnerabilities.';
  } else {
    let response = `I found ${vulnerablePackages.length} packages with vulnerabilities:\n\n`;
    vulnerablePackages.forEach((pkg, index) => {
      const severity = pkg.vulnerabilities > 2 ? 'High' : 'Low';
      response += `${index + 1}. **${pkg.name}** (${pkg.type}) - ${pkg.vulnerabilities} vulnerabilities (${severity} severity)\n`;
    });
    return response;
  }
}

function getBlockedPackages(packages: Package[]): string {
  const blockedPackages = packages.filter(pkg => pkg.vulnerabilities > 2);
  
  if (blockedPackages.length === 0) {
    return 'There are currently no blocked packages.';
  } else {
    let response = `I found ${blockedPackages.length} blocked packages due to high security risks:\n\n`;
    blockedPackages.forEach((pkg, index) => {
      response += `${index + 1}. **${pkg.name}** (${pkg.type}) - Blocked due to ${pkg.vulnerabilities} critical vulnerabilities\n`;
    });
    return response;
  }
}

function getLargestPackages(packages: Package[]): string {
  const sortedBySize = [...packages]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);
  
  let response = `Here are the 5 largest packages by size:\n\n`;
  sortedBySize.forEach((pkg, index) => {
    response += `${index + 1}. **${pkg.name}** (${pkg.type}) - ${formatBytes(pkg.size)}\n`;
  });
  
  return response;
}

function getPackageSummary(packages: Package[]): string {
  const totalPackages = packages.length;
  const totalConsumption = packages.reduce((acc, pkg) => acc + pkg.downloads, 0);
  const totalStorage = packages.reduce((acc, pkg) => acc + pkg.size, 0);
  const maliciousPackages = packages.filter(pkg => pkg.vulnerabilities > 2).length;
  
  let response = `Here's a summary of your package statistics:\n\n`;
  response += `• Total Packages: ${totalPackages}\n`;
  response += `• Total Downloads: ${formatNumber(totalConsumption)}\n`;
  response += `• Total Storage: ${formatBytes(totalStorage)}\n`;
  response += `• Malicious Packages: ${maliciousPackages}\n`;
  
  return response;
}

function getGenericResponse(input: string): string {
  return `I'm not sure I understand your query about "${input}". Here are some things you can ask me:\n\n` +
    `• Show me the latest 10 downloaded packages\n` +
    `• Show me existing packages with vulnerabilities\n` +
    `• Show me the packages that are blocked\n` +
    `• Show me the largest packages by size\n` +
    `• Give me a summary of my packages\n`;
}

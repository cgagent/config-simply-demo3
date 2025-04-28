import { ConversationFlow } from '../../utils/types';
import { CONFIG_PATTERNS } from '../patterns/configPatterns';
import { configResponses } from '../responses/configResponses';

/**
 * Configuration chat conversation flow
 */
export const configFlow: ConversationFlow = {
  id: 'config',
  name: 'Configuration Flow',
  steps: [
    {
      id: 'initial',
      patterns: ['set up', 'configure', 'setup', 'configuration'],
      response: configResponses.initial,
      nextSteps: ['package-manager-selection']
    },
    {
      id: 'package-manager-selection',
      patterns: [...CONFIG_PATTERNS.npm, ...CONFIG_PATTERNS.docker, ...CONFIG_PATTERNS.maven, ...CONFIG_PATTERNS.pypi],
      response: (input: string) => {
        if (CONFIG_PATTERNS.npm.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.npm();
        } else if (CONFIG_PATTERNS.docker.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.docker();
        } else if (CONFIG_PATTERNS.maven.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.maven();
        } else if (CONFIG_PATTERNS.pypi.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.pypi();
        }
        return configResponses.initial;
      },
      nextSteps: ['ci-tool-selection']
    },
    {
      id: 'ci-tool-selection',
      patterns: [...CONFIG_PATTERNS.github, ...CONFIG_PATTERNS.circleci, ...CONFIG_PATTERNS.jenkins, ...CONFIG_PATTERNS.gitlab],
      response: (input: string) => {
        if (CONFIG_PATTERNS.github.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.github();
        } else if (CONFIG_PATTERNS.circleci.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.circleci();
        } else if (CONFIG_PATTERNS.jenkins.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.jenkins();
        } else if (CONFIG_PATTERNS.gitlab.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.gitlab();
        }
        return configResponses.initial;
      },
      nextSteps: ['action-selection']
    },
    {
      id: 'action-selection',
      patterns: [...CONFIG_PATTERNS.merge, ...CONFIG_PATTERNS.abort, ...CONFIG_PATTERNS.viewDiff, ...CONFIG_PATTERNS.checkOnGithub],
      response: (input: string) => {
        if (CONFIG_PATTERNS.merge.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.merge();
        } else if (CONFIG_PATTERNS.abort.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.abort();
        } else if (CONFIG_PATTERNS.viewDiff.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.viewDiff();
        } else if (CONFIG_PATTERNS.checkOnGithub.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.checkOnGithub();
        }
        return configResponses.initial;
      },
      isEndOfFlow: true
    }
  ]
};

/**
 * Repository Simple Configuration Flow
 */
export const repoConfigureSimplyFlow: ConversationFlow = {
  id: 'repo-configure-simply',
  name: 'Repository Simple Configuration Flow',
  steps: [
    {
      id: 'initial',
      patterns: ['simple config', 'quick setup', 'configure simply', 'easy setup', 'repo config'],
      response: configResponses.simpleRepoConfig(),
      actionOptions: [
        { id: 'npm-repo', label: 'npm', value: 'npm repository' },
        { id: 'docker-repo', label: 'Docker', value: 'Docker repository' },
        { id: 'maven-repo', label: 'Maven', value: 'Maven repository' },
        { id: 'pypi-repo', label: 'PyPI', value: 'PyPI repository' }
      ],
      nextSteps: ['repo-type-selection']
    },
    {
      id: 'repo-type-selection',
      patterns: [...CONFIG_PATTERNS.npm, ...CONFIG_PATTERNS.docker, ...CONFIG_PATTERNS.maven, ...CONFIG_PATTERNS.pypi],
      response: (input: string) => {
        if (CONFIG_PATTERNS.npm.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.simpleNpmConfig();
        } else if (CONFIG_PATTERNS.docker.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.simpleDockerConfig();
        } else if (CONFIG_PATTERNS.maven.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.simpleMavenConfig();
        } else if (CONFIG_PATTERNS.pypi.some(pattern => input.toLowerCase().includes(pattern))) {
          return configResponses.simplePyPIConfig();
        }
        return configResponses.simpleRepoConfig();
      },
      actionOptions: [
        { id: 'auth-config', label: 'Authentication', value: 'Configure authentication' },
        { id: 'file-config', label: 'Config File', value: 'Configure config file' }
      ],
      nextSteps: ['config-option-selection']
    },
    {
      id: 'config-option-selection',
      patterns: ['authentication', 'auth', 'config file', 'configure file'],
      response: (input: string) => {
        if (input.toLowerCase().includes('auth')) {
          return 'I\'ll help you set up authentication. Would you like to use tokens or username/password?';
        } else if (input.toLowerCase().includes('file') || input.toLowerCase().includes('config file')) {
          return 'I\'ll help you configure the appropriate config file. Would you like to use a simple or advanced configuration?';
        }
        return 'Please choose either authentication or config file setup.';
      },
      actionOptions: [
        { id: 'token-auth', label: 'Token', value: 'Use token authentication' },
        { id: 'user-pass-auth', label: 'Username/Password', value: 'Use username/password' },
        { id: 'simple-config', label: 'Simple Config', value: 'Use simple configuration' },
        { id: 'advanced-config', label: 'Advanced Config', value: 'Use advanced configuration' }
      ],
      nextSteps: ['auth-method-selection']
    },
    {
      id: 'auth-method-selection',
      patterns: ['token', 'username', 'password', 'simple', 'advanced'],
      response: (input: string) => {
        if (input.toLowerCase().includes('token')) {
          return 'I\'ll create a pull request to set up token-based authentication for your repository. Would you like to proceed?';
        } else if (input.toLowerCase().includes('username') || input.toLowerCase().includes('password')) {
          return 'I\'ll create a pull request to set up username/password authentication for your repository. Would you like to proceed?';
        } else if (input.toLowerCase().includes('simple')) {
          return 'I\'ll create a pull request with a simple configuration file for your repository. Would you like to proceed?';
        } else if (input.toLowerCase().includes('advanced')) {
          return 'I\'ll create a pull request with an advanced configuration file for your repository. Would you like to proceed?';
        }
        return 'Please select an authentication method or configuration type.';
      },
      actionOptions: [
        { id: 'proceed', label: 'Proceed', value: 'Yes, proceed' },
        { id: 'cancel', label: 'Cancel', value: 'No, cancel' }
      ],
      nextSteps: ['confirmation']
    },
    {
      id: 'confirmation',
      patterns: ['yes', 'proceed', 'no', 'cancel'],
      response: (input: string) => {
        if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('proceed')) {
          return 'Great! I\'ve created a pull request with your requested configuration. You can view it now or merge it directly.';
        } else if (input.toLowerCase().includes('no') || input.toLowerCase().includes('cancel')) {
          return 'I\'ve cancelled the configuration process. Feel free to start over when you\'re ready.';
        }
        return 'Please confirm whether to proceed or cancel.';
      },
      actionOptions: [
        { id: 'view-pr', label: 'View PR', value: 'View pull request' },
        { id: 'merge-pr', label: 'Merge PR', value: 'Merge pull request' },
        { id: 'start-over', label: 'Start Over', value: 'Start over' }
      ],
      nextSteps: ['final-action']
    },
    {
      id: 'final-action',
      patterns: ['view', 'merge', 'start over'],
      response: (input: string) => {
        if (input.toLowerCase().includes('view')) {
          return 'Here\'s the pull request I\'ve created for your repository configuration.';
        } else if (input.toLowerCase().includes('merge')) {
          return 'I\'ve merged the pull request. Your repository is now configured according to your specifications.';
        } else if (input.toLowerCase().includes('start over')) {
          return 'Let\'s start over. What type of repository would you like to configure?';
        }
        return 'Please select an action to continue.';
      },
      isEndOfFlow: true
    }
  ]
}; 
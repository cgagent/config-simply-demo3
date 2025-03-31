
// Function to generate full GitHub workflow
export const generateFullGitHubSnippet = (packageTypes: string[]): string => {
  return `name: CI Pipeline with JFrog

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup JFrog
        uses: jfrog/setup-jfrog@v1
        with:
          subdomain: acme
${packageTypes.includes('npm') ? `
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Configure npm
        run: |
          npm config set registry https://acme.jfrog.io/artifactory/api/npm/npm/
          echo "//acme.jfrog.io/artifactory/api/npm/npm/:_auth=\${JFROG_API_KEY}" > .npmrc
          
      - name: Install dependencies
        run: npm ci
` : ''}${packageTypes.includes('docker') ? `
      - name: Login to JFrog
        run: |
          echo $JFROG_API_KEY | docker login acme.jfrog.io -u admin --password-stdin
          
      - name: Build and push Docker image
        run: |
          docker build -t acme.jfrog.io/docker-local/myapp:latest .
          docker push acme.jfrog.io/docker-local/myapp:latest
` : ''}`;
};

// Function to generate full snippet for other CI systems
export const generateFullOtherCISnippet = (packageTypes: string[]): string => {
  if (packageTypes.includes('npm')) {
    return `# Jenkins Pipeline Example with JFrog
pipeline {
    agent any
    
    environment {
        JFROG_PLATFORM_URL = "https://acme.jfrog.io"
        JFROG_API_KEY = credentials('jfrog-api-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'npm config set registry https://acme.jfrog.io/artifactory/api/npm/npm/'
                sh 'echo "//acme.jfrog.io/artifactory/api/npm/npm/:_auth=\${JFROG_API_KEY}" > .npmrc'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Publish') {
            steps {
                sh 'npm publish'
            }
        }
    }
}`;
  } else {
    return `# Jenkins Pipeline Example with JFrog
pipeline {
    agent any
    
    environment {
        JFROG_PLATFORM_URL = "https://acme.jfrog.io"
        JFROG_API_KEY = credentials('jfrog-api-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'echo "Setting up JFrog connection"'
                // Add your package-specific setup steps here
            }
        }
        
        stage('Build') {
            steps {
                sh 'echo "Building application"'
                // Add your build steps here
            }
        }
        
        stage('Test') {
            steps {
                sh 'echo "Running tests"'
                // Add your test steps here
            }
        }
        
        stage('Publish') {
            steps {
                sh 'echo "Publishing to JFrog"'
                // Add your publish steps here
            }
        }
    }
}`;
  }
};


// Function to generate package-specific snippets
export const generatePackageSpecificSnippets = (packageTypes: string[]): string => {
  let snippets = '';
  
  if (packageTypes.includes('npm')) {
    snippets += `\n# NPM Configuration
- name: Configure npm
  run: |
    npm config set registry https://acme.jfrog.io/artifactory/api/npm/npm/
    echo "//acme.jfrog.io/artifactory/api/npm/npm/:_auth=\${JFROG_API_KEY}" > .npmrc
`;
  }
  
  if (packageTypes.includes('docker')) {
    snippets += `\n# Docker Configuration
- name: Login to JFrog
  run: |
    echo $JFROG_API_KEY | docker login acme.jfrog.io -u admin --password-stdin
`;
  }
  
  if (packageTypes.includes('maven')) {
    snippets += `\n# Maven Configuration
- name: Configure Maven
  run: |
    mkdir -p ~/.m2
    echo "<settings><servers><server><id>jfrog</id><username>admin</username><password>\${JFROG_API_KEY}</password></server></servers></settings>" > ~/.m2/settings.xml
`;
  }
  
  if (packageTypes.includes('python')) {
    snippets += `\n# Python Configuration
- name: Configure Python
  run: |
    pip config set global.index-url https://acme.jfrog.io/artifactory/api/pypi/pypi/simple
    pip config set global.trusted-host acme.jfrog.io
`;
  }

  if (packageTypes.includes('go')) {
    snippets += `\n# Go Configuration
- name: Configure Go
  run: |
    go env -w GOPROXY=https://acme.jfrog.io/artifactory/api/go/go
`;
  }

  if (packageTypes.includes('nuget')) {
    snippets += `\n# NuGet Configuration
- name: Configure NuGet
  run: |
    dotnet nuget add source https://acme.jfrog.io/artifactory/api/nuget/nuget -n jfrog
`;
  }
  
  return snippets;
};

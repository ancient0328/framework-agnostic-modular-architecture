#!/usr/bin/env node

/**
 * Containerized Modular Monolith Project Initialization Script
 * Interactively sets up a new project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { selectPackageManager, savePackageManagerConfig } = require('./package-manager');
const { selectFrontendFramework, saveFrontendConfig, createFrontendProject } = require('./frontend-config');

// Interactive interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Project configuration
let projectConfig = {
  name: '',
  description: '',
  packageManager: null,
  frontendFramework: null,
  modules: [],
  database: 'postgres',
  useRedis: false,
  useDocker: true
};

/**
 * Ask a question interactively
 */
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Get project name
 */
async function getProjectName() {
  const defaultName = path.basename(process.cwd());
  const answer = await question(`Project name (default: ${defaultName}): `);
  return answer || defaultName;
}

/**
 * Get project description
 */
async function getProjectDescription() {
  return await question('Project description: ');
}

/**
 * Select database
 */
async function selectDatabase() {
  console.log('Select a database to use:');
  console.log('1. PostgreSQL (default)');
  console.log('2. MySQL');
  console.log('3. MongoDB');
  console.log('4. SQLite');
  
  const answer = await question('Selection: ');
  
  switch (answer) {
    case '2': return 'mysql';
    case '3': return 'mongodb';
    case '4': return 'sqlite';
    default: return 'postgres';
  }
}

/**
 * Ask whether to use Redis
 */
async function askUseRedis() {
  const answer = await question('Use Redis? (y/N): ');
  return answer.toLowerCase() === 'y';
}

/**
 * Ask whether to use Docker
 */
async function askUseDocker() {
  const answer = await question('Use Docker? (Y/n): ');
  return answer.toLowerCase() !== 'n';
}

/**
 * Select initial modules
 */
async function selectInitialModules() {
  console.log('Select initial modules (comma-separated for multiple):');
  console.log('1. auth - Authentication and authorization module');
  console.log('2. user - User management module');
  console.log('3. notification - Notification module');
  console.log('4. payment - Payment module');
  console.log('5. admin - Admin panel module');
  
  const answer = await question('Selection (default: 1,2): ');
  
  if (!answer) {
    return ['auth', 'user'];
  }
  
  const moduleMap = {
    '1': 'auth',
    '2': 'user',
    '3': 'notification',
    '4': 'payment',
    '5': 'admin'
  };
  
  return answer.split(',')
    .map(num => num.trim())
    .filter(num => moduleMap[num])
    .map(num => moduleMap[num]);
}

/**
 * Save project configuration
 */
function saveProjectConfig() {
  fs.writeFileSync(
    path.join(process.cwd(), '.project-config.json'),
    JSON.stringify(projectConfig, null, 2)
  );
}

/**
 * Create project structure
 */
function createProjectStructure() {
  const directories = [
    'docs',
    'frontend',
    'frontend/web',
    'frontend/mobile',
    'modules',
    'api-gateway',
    'auth',
    'scripts',
    'assets'
  ];
  
  // Create directories for selected modules
  projectConfig.modules.forEach(module => {
    directories.push(`modules/${module}`);
    directories.push(`modules/${module}/backend`);
    directories.push(`modules/${module}/frontend`);
  });
  
  // Create directories
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Create root package.json
 */
function createRootPackageJson() {
  const packageJson = {
    name: projectConfig.name,
    version: '0.1.0',
    description: projectConfig.description,
    private: true,
    workspaces: [
      'api-gateway',
      'auth',
      'frontend/*',
      'modules/**/backend',
      'modules/**/frontend'
    ],
    scripts: {
      dev: 'node scripts/dev.js',
      build: 'node scripts/build.js',
      'sync-assets': 'node scripts/sync-assets.js'
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('Created package.json');
}

/**
 * Create Docker Compose file
 */
function createDockerComposeFile() {
  if (!projectConfig.useDocker) {
    return;
  }
  
  let dbService = '';
  
  // Configure database service
  switch (projectConfig.database) {
    case 'postgres':
      dbService = `
  database:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${projectConfig.name}
    volumes:
      - postgres_data:/var/lib/postgresql/data`;
      break;
    case 'mysql':
      dbService = `
  database:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ${projectConfig.name}
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql`;
      break;
    case 'mongodb':
      dbService = `
  database:
    image: mongo:5
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
      MONGO_INITDB_DATABASE: ${projectConfig.name}
    volumes:
      - mongo_data:/data/db`;
      break;
  }
  
  // Configure Redis service
  const redisService = projectConfig.useRedis ? `
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data` : '';
  
  // Configure module services
  const moduleServices = projectConfig.modules.map(module => `
  ${module}:
    build:
      context: ./modules/${module}
    ports:
      - "${getModulePort(module)}:${getModulePort(module)}"
    environment:
      - NODE_ENV=development
    depends_on:
      - database${projectConfig.useRedis ? '\n      - redis' : ''}`).join('');
  
  // Docker Compose file content
  const dockerCompose = `version: '3.8'

services:
  api-gateway:
    build:
      context: ./api-gateway
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
    depends_on:
      - auth${projectConfig.modules.map(m => `\n      - ${m}`).join('')}

  auth:
    build:
      context: ./auth
    ports:
      - "4050:4050"
    environment:
      - NODE_ENV=development
    depends_on:
      - database${projectConfig.useRedis ? '\n      - redis' : ''}

  frontend:
    build:
      context: ./frontend/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - api-gateway${moduleServices}${dbService}${redisService}

volumes:${projectConfig.database === 'postgres' ? '\n  postgres_data:' : ''}${projectConfig.database === 'mysql' ? '\n  mysql_data:' : ''}${projectConfig.database === 'mongodb' ? '\n  mongo_data:' : ''}${projectConfig.useRedis ? '\n  redis_data:' : ''}
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'docker-compose.yml'),
    dockerCompose
  );
  
  console.log('Created docker-compose.yml');
}

/**
 * Get module port number
 */
function getModulePort(moduleName) {
  const basePorts = {
    auth: 4050,
    user: 4100,
    notification: 4110,
    payment: 4120,
    admin: 4130
  };
  
  return basePorts[moduleName] || 4100;
}

/**
 * Create asset synchronization script
 */
function createAssetSyncScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * Asset Synchronization Script
 * Synchronizes shared assets to each module
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Shared assets directory
const sharedAssetsDir = path.join(__dirname, '../assets');

// Target directories
const targetDirs = [
  'frontend/web/src/assets',
  'frontend/mobile/src/assets',
  ...glob.sync('modules/*/frontend/src/assets', { cwd: path.join(__dirname, '..') })
];

// Asset synchronization function
async function syncAssets() {
  // Check if shared assets directory exists
  if (!fs.existsSync(sharedAssetsDir)) {
    console.error(\`❌ Error: Shared assets directory not found: \${sharedAssetsDir}\`);
    return;
  }

  console.log('🔄 Starting asset synchronization...');

  // Process each target directory
  for (const relativeDir of targetDirs) {
    const targetDir = path.join(__dirname, '..', relativeDir);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(\`📁 Created directory: \${relativeDir}\`);
    }
    
    // Copy asset files
    const assetFiles = glob.sync('**/*', { 
      cwd: sharedAssetsDir, 
      nodir: true 
    });
    
    for (const file of assetFiles) {
      const sourcePath = path.join(sharedAssetsDir, file);
      const targetPath = path.join(targetDir, file);
      
      // Create target directory if it doesn't exist
      const targetDirPath = path.dirname(targetPath);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
      console.log(\`📄 Copied: \${file} -> \${relativeDir}\`);
    }
  }

  console.log('✅ Asset synchronization completed');
}

// When script is executed directly
if (require.main === module) {
  syncAssets().catch(err => {
    console.error('❌ Error during asset synchronization:', err);
    process.exit(1);
  });
}

module.exports = syncAssets;
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/sync-assets.js'),
    scriptContent
  );
  
  console.log('Created asset synchronization script');
}

/**
 * Create development script
 */
function createDevScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * Development Server Script
 * Starts development servers for each module in parallel
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const syncAssets = require('./sync-assets');
const { getPackageManagerConfig } = require('../package-manager');

// Get package manager configuration
const packageManager = getPackageManagerConfig();

// Get project configuration
const projectConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../.project-config.json'), 'utf8')
);

// Function to start development servers
async function startDevServers() {
  // First synchronize assets
  await syncAssets();
  
  console.log('🚀 Starting development servers...');
  
  // Frontend server
  const frontendProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../frontend/web'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // API Gateway
  const apiGatewayProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../api-gateway'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // Authentication server
  const authProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../auth'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // Module servers
  const moduleProcesses = projectConfig.modules.map(module => {
    return spawn(
      packageManager.name,
      [packageManager.runCmd, 'dev'],
      {
        cwd: path.join(__dirname, \`../modules/\${module}/backend\`),
        stdio: 'inherit',
        shell: true
      }
    );
  });
  
  // Cleanup on process exit
  const cleanup = () => {
    console.log('\\n🛑 Stopping development servers...');
    frontendProcess.kill();
    apiGatewayProcess.kill();
    authProcess.kill();
    moduleProcesses.forEach(p => p.kill());
    process.exit(0);
  };
  
  // Signal handling
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// When script is executed directly
if (require.main === module) {
  startDevServers().catch(err => {
    console.error('❌ Error starting development servers:', err);
    process.exit(1);
  });
}
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/dev.js'),
    scriptContent
  );
  
  console.log('Created development script');
}

/**
 * Create README file
 */
function createReadme() {
  const readmeContent = `# ${projectConfig.name}

${projectConfig.description}

## Project Structure

\`\`\`
${projectConfig.name}/
├── api-gateway/        # API Gateway
├── auth/               # Authentication Service
├── docs/               # Documentation
├── frontend/           # Frontend
│   ├── web/            # Web Application
│   └── mobile/         # Mobile Application
├── modules/            # Functional Modules
${projectConfig.modules.map(m => `│   └── ${m}/            # ${getModuleDescription(m)}`).join('\n')}
├── assets/             # Shared Assets
├── scripts/            # Utility Scripts
├── docker-compose.yml  # Docker Configuration
└── package.json        # Project Configuration
\`\`\`

## Development Environment Setup

### Prerequisites

- Node.js ${getNodeVersion()} or higher
- ${projectConfig.packageManager.name}
- ${projectConfig.useDocker ? 'Docker' : ''}

### Installation

\`\`\`bash
# Install dependencies
${projectConfig.packageManager.installCmd}

# Start development server
${projectConfig.packageManager.runCmd} dev
\`\`\`

${projectConfig.useDocker ? `
### Running with Docker

\`\`\`bash
# Build and start containers
docker-compose up --build
\`\`\`
` : ''}

## Modules

This project consists of the following modules:

${projectConfig.modules.map(m => `- **${m}**: ${getModuleDescription(m)}`).join('\n')}

## Asset Management

Shared assets are placed in the \`assets/\` directory and are automatically synchronized to each module.

\`\`\`bash
# Synchronize assets
${projectConfig.packageManager.runCmd} sync-assets
\`\`\`

## License

This project is published under the [MIT License](LICENSE).
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'README.md'),
    readmeContent
  );
  
  console.log('Created README');
}

/**
 * Get module description
 */
function getModuleDescription(moduleName) {
  const descriptions = {
    auth: 'Authentication and Authorization Module',
    user: 'User Management Module',
    notification: 'Notification Module',
    payment: 'Payment Module',
    admin: 'Admin Panel Module'
  };
  
  return descriptions[moduleName] || `${moduleName} Module`;
}

/**
 * Get Node.js version
 */
function getNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    return version.replace('v', '');
  } catch (error) {
    return '14.0.0';
  }
}

/**
 * Initialize frontend project
 */
async function initializeFrontend() {
  const webDir = path.join(process.cwd(), 'frontend/web');
  
  if (!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, { recursive: true });
  }
  
  console.log(`Initializing frontend project (${projectConfig.frontendFramework.name})...`);
  
  try {
    createFrontendProject(
      projectConfig.frontendFramework,
      webDir,
      { args: '--template typescript' }
    );
  } catch (error) {
    console.error(`Error during frontend initialization: ${error.message}`);
  }
}

/**
 * Main process
 */
async function main() {
  console.log('🚀 Starting containerized modular monolith project initialization');
  
  try {
    // Collect project information
    projectConfig.name = await getProjectName();
    projectConfig.description = await getProjectDescription();
    
    // Select package manager
    projectConfig.packageManager = await selectPackageManager();
    savePackageManagerConfig(projectConfig.packageManager);
    
    // Select frontend framework
    const frontendKey = await selectFrontendFramework();
    projectConfig.frontendFramework = saveFrontendConfig(frontendKey);
    
    // Select database
    projectConfig.database = await selectDatabase();
    
    // Ask about Redis
    projectConfig.useRedis = await askUseRedis();
    
    // Ask about Docker
    projectConfig.useDocker = await askUseDocker();
    
    // Select initial modules
    projectConfig.modules = await selectInitialModules();
    
    // Save configuration
    saveProjectConfig();
    
    // Create project structure
    createProjectStructure();
    
    // Create various files
    createRootPackageJson();
    if (projectConfig.useDocker) {
      createDockerComposeFile();
    }
    createAssetSyncScript();
    createDevScript();
    createReadme();
    
    // Initialize frontend project
    await initializeFrontend();
    
    console.log(`
✅ Project initialization completed!

Next steps:
1. Install dependencies: ${projectConfig.packageManager.installCmd}
2. Start development server: ${projectConfig.packageManager.runCmd} dev
${projectConfig.useDocker ? `3. Run with Docker: docker-compose up --build` : ''}

See README.md for details.
`);
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  } finally {
    rl.close();
  }
}

// When script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  initializeProject: main
};

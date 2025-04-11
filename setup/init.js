/**
 * Framework-Agnostic Modular Architecture (FAMA) Setup Script
 * 
 * This script performs the initial setup for the Framework-Agnostic Modular Architecture (FAMA).
 * - Setting up the development environment
 * - Installing necessary modules
 * - Configuring initial settings
 * - Creating directory structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for display
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

// Configuration options
const config = {
  projectName: '',
  modules: {
    frontend: false,
    backend: false
  },
  frontendFramework: '',
  backendFramework: '',
  packageManager: 'npm',
  cloudProvider: 'none',
  language: 'en', // Default language
  createDirectories: true, // Default to creating directories
  installMsyn: true // Default to installing msyn
};

// Load localization
let locale;

/**
 * Load the selected language
 */
function loadLocale(language) {
  try {
    locale = require(`./locales/${language}.js`);
    config.language = language;
  } catch (error) {
    console.error(`${colors.fg.red}Failed to load language: ${language}. Falling back to English.${colors.reset}`);
    locale = require('./locales/en.js');
    config.language = 'en';
  }
}

/**
 * Ask for language preference
 */
function askLanguage() {
  return new Promise((resolve) => {
    console.log('\n');
    console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
    console.log(`${colors.bright}${colors.fg.cyan}  Language / 言語${colors.reset}`);
    console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
    console.log('1. English');
    console.log('2. 日本語');
    
    rl.question(`${colors.fg.yellow}Select language / 言語を選択 (1-2): ${colors.reset}`, (answer) => {
      switch (answer.trim()) {
        case '1':
          loadLocale('en');
          break;
        case '2':
          loadLocale('ja');
          break;
        default:
          loadLocale('en');
      }
      resolve();
    });
  });
}

/**
 * Display welcome message
 */
function showWelcome() {
  console.log('\n');
  console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.cyan}  ${locale.welcome.title}${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
  console.log('\n');
  console.log(`${colors.fg.green}${locale.welcome.description}${colors.reset}`);
  console.log(`${colors.fg.green}${locale.welcome.instructions}${colors.reset}`);
  console.log('\n');
}

/**
 * Get project name
 */
function askProjectName() {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}${locale.project.namePrompt}${colors.reset}`, (answer) => {
      config.projectName = answer.trim() || 'framework-agnostic-modular-architecture-project';
      console.log(`${colors.fg.green}${locale.project.nameConfirm}${config.projectName}${colors.reset}`);
      resolve();
    });
  });
}

/**
 * Select modules to use
 */
function askModules() {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}${locale.modules.frontendPrompt}${colors.reset}`, (answer) => {
      config.modules.frontend = answer.toLowerCase() === 'y';
      
      rl.question(`${colors.fg.yellow}${locale.modules.backendPrompt}${colors.reset}`, (answer) => {
        config.modules.backend = answer.toLowerCase() === 'y';
        resolve();
      });
    });
  });
}

/**
 * Select frontend framework
 */
function askFrontendFramework() {
  return new Promise((resolve) => {
    if (!config.modules.frontend) {
      resolve();
      return;
    }
    
    console.log(`${colors.fg.yellow}${locale.frontend.title}${colors.reset}`);
    console.log(locale.frontend.option1);
    console.log(locale.frontend.option2);
    console.log(locale.frontend.option3);
    
    rl.question(`${colors.fg.yellow}${locale.frontend.prompt}${colors.reset}`, (answer) => {
      switch (answer.trim()) {
        case '1':
          config.frontendFramework = 'svelte';
          break;
        case '2':
          config.frontendFramework = 'react';
          break;
        case '3':
          config.frontendFramework = 'vue';
          break;
        default:
          config.frontendFramework = 'svelte';
      }
      
      console.log(`${colors.fg.green}${locale.frontend.confirm}${config.frontendFramework}${colors.reset}`);
      resolve();
    });
  });
}

/**
 * Select backend framework
 */
function askBackendFramework() {
  return new Promise((resolve) => {
    if (!config.modules.backend) {
      resolve();
      return;
    }
    
    console.log(`${colors.fg.yellow}${locale.backend.title}${colors.reset}`);
    console.log(locale.backend.option1);
    console.log(locale.backend.option2);
    console.log(locale.backend.option3);
    
    rl.question(`${colors.fg.yellow}${locale.backend.prompt}${colors.reset}`, (answer) => {
      switch (answer.trim()) {
        case '1':
          config.backendFramework = 'express';
          break;
        case '2':
          config.backendFramework = 'nestjs';
          break;
        case '3':
          config.backendFramework = 'fastify';
          break;
        default:
          config.backendFramework = 'express';
      }
      
      console.log(`${colors.fg.green}${locale.backend.confirm}${config.backendFramework}${colors.reset}`);
      resolve();
    });
  });
}

/**
 * Select package manager
 */
function askPackageManager() {
  return new Promise((resolve) => {
    console.log(`${colors.fg.yellow}${locale.packageManager.title}${colors.reset}`);
    console.log(locale.packageManager.option1);
    console.log(locale.packageManager.option2);
    console.log(locale.packageManager.option3);
    
    rl.question(`${colors.fg.yellow}${locale.packageManager.prompt}${colors.reset}`, (answer) => {
      switch (answer.trim()) {
        case '1':
          config.packageManager = 'npm';
          break;
        case '2':
          config.packageManager = 'yarn';
          break;
        case '3':
          config.packageManager = 'pnpm';
          break;
        default:
          config.packageManager = 'npm';
      }
      
      console.log(`${colors.fg.green}${locale.packageManager.confirm}${config.packageManager}${colors.reset}`);
      resolve();
    });
  });
}

/**
 * Select cloud provider
 */
function askCloudProvider() {
  return new Promise((resolve) => {
    console.log(`${colors.fg.yellow}${locale.cloudProvider.title}${colors.reset}`);
    console.log(locale.cloudProvider.option1);
    console.log(locale.cloudProvider.option2);
    console.log(locale.cloudProvider.option3);
    console.log(locale.cloudProvider.option4);
    
    rl.question(`${colors.fg.yellow}${locale.cloudProvider.prompt}${colors.reset}`, (answer) => {
      switch (answer.trim()) {
        case '1':
          config.cloudProvider = 'none';
          break;
        case '2':
          config.cloudProvider = 'aws';
          break;
        case '3':
          config.cloudProvider = 'gcp';
          break;
        case '4':
          config.cloudProvider = 'azure';
          break;
        default:
          config.cloudProvider = 'none';
      }
      
      console.log(`${colors.fg.green}${locale.cloudProvider.confirm}${config.cloudProvider}${colors.reset}`);
      resolve();
    });
  });
}

/**
 * Confirm setup
 */
function confirmSetup() {
  return new Promise((resolve) => {
    console.log('\n');
    console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
    console.log(`${colors.bright}${colors.fg.cyan}  ${locale.confirmation.title}${colors.reset}`);
    console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
    console.log(`${colors.fg.white}${locale.confirmation.projectName}${config.projectName}${colors.reset}`);
    console.log(`${colors.fg.white}${locale.confirmation.frontend}${config.modules.frontend ? locale.confirmation.frontendYes : locale.confirmation.frontendNo}${colors.reset}`);
    if (config.modules.frontend) {
      console.log(`${colors.fg.white}${locale.confirmation.frontendFramework}${config.frontendFramework}${colors.reset}`);
    }
    console.log(`${colors.fg.white}${locale.confirmation.backend}${config.modules.backend ? locale.confirmation.backendYes : locale.confirmation.backendNo}${colors.reset}`);
    if (config.modules.backend) {
      console.log(`${colors.fg.white}${locale.confirmation.backendFramework}${config.backendFramework}${colors.reset}`);
    }
    console.log(`${colors.fg.white}${locale.confirmation.packageManager}${config.packageManager}${colors.reset}`);
    console.log(`${colors.fg.white}${locale.confirmation.cloudProvider}${config.cloudProvider}${colors.reset}`);
    console.log('\n');
    
    rl.question(`${colors.fg.yellow}${locale.confirmation.prompt}${colors.reset}`, (answer) => {
      if (answer.toLowerCase() === 'y') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Initialize project
 */
function initializeProject() {
  console.log('\n');
  console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.cyan}  ${locale.initialization.title}${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.cyan}=======================================${colors.reset}`);
  
  // Save configuration file
  const configPath = path.join(process.cwd(), 'framework-agnostic-modular-architecture.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${colors.fg.green}${locale.initialization.configSaved}${colors.reset}`);
  
  // Create necessary directories
  console.log(`${colors.fg.green}${locale.initialization.creatingDirectories}${colors.reset}`);
  
  // Create the complete directory structure
  if (config.createDirectories) {
    createDirectoryStructure();
  }
  
  // Copy sample modules
  if (config.modules.frontend) {
    console.log(`${colors.fg.green}${locale.initialization.setupFrontend}${colors.reset}`);
    // Add frontend module setup code here
  }
  
  if (config.modules.backend) {
    console.log(`${colors.fg.green}${locale.initialization.setupBackend}${colors.reset}`);
    // Add backend module setup code here
  }
  
  console.log(`${colors.fg.green}${locale.initialization.installingDependencies}${colors.reset}`);
  
  // Create package.json if it doesn't exist
  createPackageJson();
  
  // Install msyn if requested
  if (config.installMsyn) {
    installMsyn();
  }
  
  console.log('\n');
  console.log(`${colors.bright}${colors.fg.green}=======================================${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.green}  ${locale.completion.title}${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.green}=======================================${colors.reset}`);
  console.log(`${colors.fg.cyan}${locale.completion.message}${colors.reset}`);
  console.log(`${colors.fg.cyan}${locale.completion.startInstructions}${colors.reset}`);
  console.log('\n');
  console.log(`  cd ${config.projectName}`);
  
  if (config.modules.frontend) {
    console.log(`  ${config.packageManager} run dev:frontend`);
  }
  
  if (config.modules.backend) {
    console.log(`  ${config.packageManager} run dev:backend`);
  }
  
  if (config.installMsyn) {
    console.log('\n');
    console.log(`${colors.fg.cyan}To use msyn for asset synchronization:${colors.reset}`);
    console.log(`  npx msyn sync`);
  }
  
  console.log('\n');
  console.log(`${colors.fg.cyan}${locale.completion.documentation}${colors.reset}`);
  console.log('\n');
}

/**
 * Create the complete directory structure
 */
function createDirectoryStructure() {
  console.log(`${colors.fg.cyan}Creating Framework-Agnostic Modular Architecture directory structure...${colors.reset}`);
  
  // Define the minimum directory structure
  const directories = [
    // assets
    'framework/assets',
    'framework/assets/fonts',
    'framework/assets/icons',
    'framework/assets/images',
    'framework/assets/images-optimized',
    
    // backend
    'framework/backend',
    'framework/backend/api-gateway',
    'framework/backend/auth-service',
    'framework/backend/modules',
    
    // core
    'framework/core',
    'framework/core/api',
    'framework/core/auth',
    'framework/core/communication',
    'framework/core/utils',
    
    // docs
    'framework/docs',
    'framework/docs/api',
    'framework/docs/architecture',
    'framework/docs/diagrams',
    'framework/docs/guides',
    'framework/docs/learning',
    'framework/docs/templates',
    
    // frontend
    'framework/frontend',
    'framework/frontend/core',
    'framework/frontend/core/web',
    'framework/frontend/core/mobile',
    'framework/frontend/modules',
    
    // infrastructure
    'framework/infrastructure',
    'framework/infrastructure/aws',
    'framework/infrastructure/azure',
    'framework/infrastructure/gcp',
    'framework/infrastructure/on-premise',
    
    // scripts (msyn is now an npm package, so we don't include it here)
    'framework/scripts'
  ];
  
  // Create all directories
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`${colors.fg.green}Created directory: ${dir}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.fg.red}Error creating directory ${dir}: ${error.message}${colors.reset}`);
    }
  });
  
  // Create basic files
  createBasicFiles();
}

/**
 * Create basic files in the directory structure
 */
function createBasicFiles() {
  console.log(`${colors.fg.cyan}Creating basic files...${colors.reset}`);
  
  // Create registry.json
  const registryContent = {
    "version": "1.0.0",
    "modules": [
      {
        "id": "sample-module",
        "name": "サンプルモジュール",
        "description": "フレームワークのサンプルモジュール",
        "path": "sample-module",
        "implementations": {
          "web": [],
          "mobile": []
        },
        "version": "0.1.0",
        "dependencies": [],
        "enabled": true
      }
    ]
  };
  
  const registryPath = path.join(process.cwd(), 'framework/frontend/modules/registry.json');
  try {
    fs.writeFileSync(registryPath, JSON.stringify(registryContent, null, 2));
    console.log(`${colors.fg.green}Created file: framework/frontend/modules/registry.json${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Error creating registry.json: ${error.message}${colors.reset}`);
  }
  
  // Create README files for key directories
  const readmeContents = {
    'framework': '# Framework-Agnostic Modular Architecture (FAMA)\n\nThis is the root directory for the FAMA project structure.',
    'framework/assets': '# Assets\n\nShared assets for all modules and frameworks.',
    'framework/backend': '# Backend\n\nBackend services and modules.',
    'framework/core': '# Core\n\nShared core functionality across all modules and frameworks.',
    'framework/docs': '# Documentation\n\nProject documentation and guides.',
    'framework/frontend': '# Frontend\n\nFrontend modules and implementations.',
    'framework/infrastructure': '# Infrastructure\n\nInfrastructure configuration for different cloud providers.',
    'framework/scripts': '# Scripts\n\nUtility scripts for development and deployment.'
  };
  
  Object.entries(readmeContents).forEach(([dir, content]) => {
    const readmePath = path.join(process.cwd(), dir, 'README.md');
    try {
      fs.writeFileSync(readmePath, content);
      console.log(`${colors.fg.green}Created file: ${dir}/README.md${colors.reset}`);
    } catch (error) {
      console.error(`${colors.fg.red}Error creating README in ${dir}: ${error.message}${colors.reset}`);
    }
  });
  
  // Add .gitkeep files to empty directories
  directories.forEach(dir => {
    // Skip directories that already have files
    if (dir === 'framework/frontend/modules') return;
    
    const fullPath = path.join(process.cwd(), dir);
    const gitkeepPath = path.join(fullPath, '.gitkeep');
    
    try {
      // Check if directory exists and is empty
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        if (files.length === 0) {
          fs.writeFileSync(gitkeepPath, '');
          console.log(`${colors.fg.green}Created file: ${dir}/.gitkeep${colors.reset}`);
        }
      }
    } catch (error) {
      console.error(`${colors.fg.red}Error creating .gitkeep in ${dir}: ${error.message}${colors.reset}`);
    }
  });
  
  // Create .msyn.json configuration file
  createMsynConfig();
}

/**
 * Create .msyn.json configuration file
 */
function createMsynConfig() {
  const msynConfig = {
    "version": "1.0.0",
    "language": config.language,
    "sourceDir": "framework/assets/images",
    "optimizedDir": "framework/assets/images-optimized",
    "modules": [
      {
        "name": "framework/frontend/core/web/svelte",
        "targetDir": "static/images",
        "enabled": config.frontendFramework === 'Svelte'
      },
      {
        "name": "framework/frontend/core/web/react",
        "targetDir": "public/images",
        "enabled": config.frontendFramework === 'React'
      },
      {
        "name": "framework/frontend/core/web/vue",
        "targetDir": "public/images",
        "enabled": config.frontendFramework === 'Vue'
      },
      {
        "name": "framework/frontend/core/mobile/react-native",
        "targetDir": "src/assets/images",
        "enabled": false
      },
      {
        "name": "framework/frontend/core/mobile/flutter",
        "targetDir": "assets/images",
        "enabled": false
      }
    ],
    "options": {
      "autoOptimize": true,
      "watchDelay": 2000
    }
  };
  
  const msynConfigPath = path.join(process.cwd(), '.msyn.json');
  try {
    fs.writeFileSync(msynConfigPath, JSON.stringify(msynConfig, null, 2));
    console.log(`${colors.fg.green}Created file: .msyn.json${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Error creating .msyn.json: ${error.message}${colors.reset}`);
  }
}

/**
 * Create package.json file
 */
function createPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  // Check if package.json already exists
  if (fs.existsSync(packageJsonPath)) {
    console.log(`${colors.fg.yellow}package.json already exists, updating...${colors.reset}`);
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Add msyn as a dependency if it doesn't exist
      if (config.installMsyn) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        if (!packageJson.devDependencies.msyn) {
          packageJson.devDependencies.msyn = "^1.0.0";
        }
      }
      
      // Update package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`${colors.fg.green}Updated package.json${colors.reset}`);
    } catch (error) {
      console.error(`${colors.fg.red}Error updating package.json: ${error.message}${colors.reset}`);
    }
  } else {
    // Create new package.json
    const packageJson = {
      "name": config.projectName,
      "version": "0.1.0",
      "description": "A project built with Framework-Agnostic Modular Architecture (FAMA)",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [
        "fama",
        "framework-agnostic",
        "modular",
        "architecture"
      ],
      "author": "",
      "license": "MIT",
      "devDependencies": config.installMsyn ? { "msyn": "^1.0.0" } : {}
    };
    
    try {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`${colors.fg.green}Created file: package.json${colors.reset}`);
    } catch (error) {
      console.error(`${colors.fg.red}Error creating package.json: ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Install msyn from npm
 */
function installMsyn() {
  console.log(`${colors.fg.green}Installing msyn from npm...${colors.reset}`);
  try {
    let cmd;
    switch (config.packageManager) {
      case 'yarn':
        cmd = 'yarn add msyn --dev';
        break;
      case 'pnpm':
        cmd = 'pnpm add msyn --save-dev';
        break;
      default:
        cmd = 'npm install msyn --save-dev';
    }
    
    execSync(cmd, { stdio: 'inherit' });
    console.log(`${colors.fg.green}msyn installed successfully.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Failed to install msyn: ${error.message}${colors.reset}`);
    console.log(`${colors.fg.yellow}You can install msyn manually later with: ${config.packageManager} install msyn --save-dev${colors.reset}`);
  }
}

/**
 * Ask if user wants to create directory structure
 */
function askCreateDirectories() {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}Do you want to create the complete directory structure? (y/n): ${colors.reset}`, (answer) => {
      config.createDirectories = answer.toLowerCase() === 'y';
      resolve();
    });
  });
}

/**
 * Ask if user wants to install msyn
 */
function askInstallMsyn() {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}Do you want to install msyn for asset synchronization? (y/n): ${colors.reset}`, (answer) => {
      config.installMsyn = answer.toLowerCase() === 'y';
      resolve();
    });
  });
}

/**
 * Main function
 */
async function main() {
  await askLanguage();
  showWelcome();
  
  await askProjectName();
  await askModules();
  await askFrontendFramework();
  await askBackendFramework();
  await askPackageManager();
  await askCloudProvider();
  await askCreateDirectories();
  await askInstallMsyn();
  
  const confirmed = await confirmSetup();
  
  if (confirmed) {
    initializeProject();
  } else {
    console.log(`${colors.fg.yellow}${locale.errors.setupCancelled}${colors.reset}`);
  }
  
  rl.close();
}

// Run script
main().catch(err => {
  console.error(`${colors.fg.red}${locale.errors.generalError}${colors.reset}`, err);
  rl.close();
});

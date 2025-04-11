/**
 * Containerized Modular Monolith Framework Setup Script
 * 
 * This script performs the initial setup for the Containerized Modular Monolith Framework.
 * - Setting up the development environment
 * - Installing necessary modules
 * - Configuring initial settings
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
  language: 'en' // Default language
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
      config.projectName = answer.trim() || 'containerized-modular-monolith-project';
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
  const configPath = path.join(process.cwd(), 'containerized-modular-monolith.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${colors.fg.green}${locale.initialization.configSaved}${colors.reset}`);
  
  // Create necessary directories
  console.log(`${colors.fg.green}${locale.initialization.creatingDirectories}${colors.reset}`);
  
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
  // Add dependency installation code here
  
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
  
  console.log('\n');
  console.log(`${colors.fg.cyan}${locale.completion.documentation}${colors.reset}`);
  console.log('\n');
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

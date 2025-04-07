#!/usr/bin/env node

/**
 * Project Initialization Script
 * Initializes a containerized modular monolith project using pnpm and Turborepo
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Project root directory
const rootDir = path.join(__dirname, '..');

// Project configuration file
const projectConfigFile = path.join(rootDir, '.project-config.json');

// Default configuration
const defaultConfig = {
  name: 'my-modular-monolith',
  description: 'Containerized Modular Monolith Project',
  version: '0.1.0',
  author: '',
  modules: ['module-a', 'module-b'],
  frontends: ['web'],
  database: 'postgres',
  cache: 'redis',
  monitoring: true
};

/**
 * Display a question and get the answer
 * @param {string} question - Question text
 * @param {string} defaultValue - Default value
 * @returns {Promise<string>} - User's answer
 */
function askQuestion(question, defaultValue = '') {
  const defaultText = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${defaultText}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

/**
 * Select from multiple choices
 * @param {string} question - Question text
 * @param {string[]} choices - Choices
 * @param {string[]} defaults - Default selections
 * @returns {Promise<string[]>} - Selected items
 */
async function askMultipleChoice(question, choices, defaults = []) {
  console.log(`${question} (comma-separated for multiple, empty for ${defaults.join(', ')})`);
  choices.forEach((choice, index) => {
    const isDefault = defaults.includes(choice);
    console.log(`${index + 1}. ${choice}${isDefault ? ' (default)' : ''}`);
  });
  
  const answer = await askQuestion('Select (numbers or comma-separated names)');
  
  if (!answer) return defaults;
  
  // If selected by numbers
  if (/^[0-9,]+$/.test(answer)) {
    return answer.split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => num > 0 && num <= choices.length)
      .map(num => choices[num - 1]);
  }
  
  // If selected by names
  return answer.split(',')
    .map(name => name.trim())
    .filter(name => choices.includes(name));
}

/**
 * Yes/No question
 * @param {string} question - Question text
 * @param {boolean} defaultValue - Default value
 * @returns {Promise<boolean>} - User's answer
 */
async function askYesNo(question, defaultValue = true) {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  const answer = await askQuestion(`${question} [${defaultText}]`);
  
  if (!answer) return defaultValue;
  
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * Update package.json file
 * @param {Object} config - Project configuration
 */
function updatePackageJson(config) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.name = config.name;
  packageJson.description = config.description;
  packageJson.version = config.version;
  packageJson.author = config.author;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json');
}

/**
 * Update README file
 * @param {Object} config - Project configuration
 */
function updateReadme(config) {
  const readmePath = path.join(rootDir, 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Update title and description
  readmeContent = readmeContent.replace(
    /# .*?\n/,
    `# ${config.name}\n`
  );
  
  readmeContent = readmeContent.replace(
    /This repository is.*?\./,
    `${config.description}`
  );
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('Updated README.md');
}

/**
 * Add modules
 * @param {string[]} modules - Array of module names to add
 */
function setupModules(modules) {
  const templateDir = path.join(rootDir, 'modules', '_template_');
  
  // Remove existing modules (except _template_)
  const modulesDir = path.join(rootDir, 'modules');
  fs.readdirSync(modulesDir).forEach(file => {
    const filePath = path.join(modulesDir, file);
    if (file !== '_template_' && fs.statSync(filePath).isDirectory()) {
      try {
        execSync(`rm -rf ${filePath}`);
      } catch (error) {
        console.error(`Failed to remove module ${file}:`, error);
      }
    }
  });
  
  // Add new modules
  modules.forEach(module => {
    const moduleDir = path.join(rootDir, 'modules', module);
    
    try {
      execSync(`cp -r ${templateDir} ${moduleDir}`);
      
      // Update package.json
      const packageJsonPath = path.join(moduleDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        packageJson.name = `@${defaultConfig.name}/${module}`;
        packageJson.description = `${module} module`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
      
      console.log(`Created module ${module}`);
    } catch (error) {
      console.error(`Failed to create module ${module}:`, error);
    }
  });
}

/**
 * Configure frontends
 * @param {string[]} frontends - Frontends to configure
 */
function setupFrontends(frontends) {
  const frontendTypes = {
    web: 'Web Frontend',
    mobile: 'Mobile Frontend'
  };
  
  // Check existing frontends
  const frontendDir = path.join(rootDir, 'frontend');
  Object.keys(frontendTypes).forEach(type => {
    const typeDir = path.join(frontendDir, type);
    const include = frontends.includes(type);
    
    if (include && !fs.existsSync(typeDir)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(typeDir, { recursive: true });
      
      // Create package.json
      const packageJson = {
        name: `@${defaultConfig.name}/${type}-frontend`,
        version: '0.1.0',
        description: `${frontendTypes[type]}`,
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
          lint: 'eslint . --ext .ts,.tsx',
          format: 'prettier --write "src/**/*.{ts,tsx}"',
          test: 'vitest run',
          clean: 'rimraf dist'
        }
      };
      
      fs.writeFileSync(
        path.join(typeDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      console.log(`Created ${frontendTypes[type]}`);
    } else if (!include && fs.existsSync(typeDir)) {
      // Remove unnecessary frontends
      try {
        execSync(`rm -rf ${typeDir}`);
        console.log(`Removed ${frontendTypes[type]}`);
      } catch (error) {
        console.error(`Failed to remove ${frontendTypes[type]}:`, error);
      }
    }
  });
}

/**
 * Update docker-compose.yml
 * @param {Object} config - Project configuration
 */
function updateDockerCompose(config) {
  const dockerComposePath = path.join(rootDir, 'docker-compose.yml');
  let dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
  
  // Database configuration
  if (config.database !== 'postgres') {
    // Process for using databases other than PostgreSQL
    // Currently only PostgreSQL is supported
  }
  
  // Cache configuration
  if (config.cache !== 'redis') {
    // Process for using caches other than Redis
    // Currently only Redis is supported
  }
  
  // Monitoring configuration
  if (!config.monitoring) {
    // When disabling monitoring
    dockerComposeContent = dockerComposeContent
      .replace(/\s+# Prometheus.*?app-network\n/s, '\n')
      .replace(/\s+# Grafana.*?app-network\n/s, '\n')
      .replace(/\s+prometheus-data:/, '')
      .replace(/\s+grafana-data:/, '');
  }
  
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  console.log('Updated docker-compose.yml');
}

/**
 * Save project configuration
 * @param {Object} config - Project configuration
 */
function saveProjectConfig(config) {
  fs.writeFileSync(projectConfigFile, JSON.stringify(config, null, 2));
  console.log('Saved project configuration');
}

/**
 * Initialize project
 */
async function initProject() {
  console.log('Starting containerized modular monolith project initialization');
  
  // Load existing configuration
  let config = {};
  if (fs.existsSync(projectConfigFile)) {
    try {
      config = JSON.parse(fs.readFileSync(projectConfigFile, 'utf8'));
      console.log('Loaded existing project configuration');
    } catch (error) {
      console.error('Failed to load existing configuration. Using default settings.');
      config = { ...defaultConfig };
    }
  } else {
    config = { ...defaultConfig };
  }
  
  // Input project information
  config.name = await askQuestion('Project name', config.name);
  config.description = await askQuestion('Project description', config.description);
  config.version = await askQuestion('Version', config.version);
  config.author = await askQuestion('Author', config.author);
  
  // Module configuration
  const defaultModules = config.modules || defaultConfig.modules;
  config.modules = await askMultipleChoice(
    'Select modules to include in the project',
    ['module-a', 'module-b', 'module-c', 'module-d'],
    defaultModules
  );
  
  // Frontend configuration
  const defaultFrontends = config.frontends || defaultConfig.frontends;
  config.frontends = await askMultipleChoice(
    'Select frontends to include in the project',
    ['web', 'mobile'],
    defaultFrontends
  );
  
  // Database configuration
  config.database = await askQuestion(
    'Select database (postgres)',
    config.database || defaultConfig.database
  );
  
  // Cache configuration
  config.cache = await askQuestion(
    'Select cache (redis)',
    config.cache || defaultConfig.cache
  );
  
  // Monitoring configuration
  config.monitoring = await askYesNo(
    'Enable monitoring (Prometheus/Grafana)?',
    config.monitoring !== undefined ? config.monitoring : defaultConfig.monitoring
  );
  
  // Configuration summary
  console.log('\nProject Configuration Summary:');
  console.log(`Project name: ${config.name}`);
  console.log(`Description: ${config.description}`);
  console.log(`Version: ${config.version}`);
  console.log(`Author: ${config.author}`);
  console.log(`Modules: ${config.modules.join(', ')}`);
  console.log(`Frontends: ${config.frontends.join(', ')}`);
  console.log(`Database: ${config.database}`);
  console.log(`Cache: ${config.cache}`);
  console.log(`Monitoring: ${config.monitoring ? 'enabled' : 'disabled'}`);
  
  const confirm = await askYesNo('\nInitialize project with these settings?');
  if (!confirm) {
    console.log('Project initialization cancelled');
    rl.close();
    return;
  }
  
  // Project initialization
  try {
    updatePackageJson(config);
    updateReadme(config);
    setupModules(config.modules);
    setupFrontends(config.frontends);
    updateDockerCompose(config);
    saveProjectConfig(config);
    
    console.log('\nProject initialization completed');
    console.log('\nNext steps:');
    console.log('1. Run pnpm install to install dependencies');
    console.log('2. Run pnpm dev to start the development server');
    console.log('3. Run docker-compose up -d to start containers');
  } catch (error) {
    console.error('An error occurred during project initialization:', error);
  }
  
  rl.close();
}

// When script is executed directly
if (require.main === module) {
  initProject().catch(err => {
    console.error('An error occurred during project initialization:', err);
    process.exit(1);
  });
}

module.exports = initProject;

#!/usr/bin/env node

/**
 * Turborepo Optimization Script
 * Optimizes Turborepo configuration based on project scale and requirements
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Project root directory
const rootDir = path.join(__dirname, '..');

// Turborepo configuration file
const turboConfigFile = path.join(rootDir, 'turbo.json');

// Project configuration file
const projectConfigFile = path.join(rootDir, '.project-config.json');

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
 * Select from multiple choices
 * @param {string} question - Question text
 * @param {string[]} choices - Options
 * @param {string[]} defaults - Default selections
 * @returns {Promise<string[]>} - Selected items
 */
async function askMultipleChoice(question, choices, defaults = []) {
  console.log(`${question} (comma-separated for multiple choices, empty for ${defaults.join(', ')})`);
  choices.forEach((choice, index) => {
    const isDefault = defaults.includes(choice);
    console.log(`${index + 1}. ${choice}${isDefault ? ' (default)' : ''}`);
  });
  
  const answer = await askQuestion('Please select (numbers or comma-separated names)');
  
  if (!answer) return defaults;
  
  // Selection by number
  if (/^[0-9,]+$/.test(answer)) {
    return answer.split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => num > 0 && num <= choices.length)
      .map(num => choices[num - 1]);
  }
  
  // Selection by name
  return answer.split(',')
    .map(name => name.trim())
    .filter(name => choices.includes(name));
}

/**
 * Load current Turborepo configuration
 * @returns {Object} - Turborepo configuration
 */
function loadTurboConfig() {
  if (fs.existsSync(turboConfigFile)) {
    try {
      return JSON.parse(fs.readFileSync(turboConfigFile, 'utf8'));
    } catch (error) {
      console.error('Failed to load turbo.json:', error);
      return getDefaultTurboConfig();
    }
  }
  
  return getDefaultTurboConfig();
}

/**
 * Get default Turborepo configuration
 * @returns {Object} - Default Turborepo configuration
 */
function getDefaultTurboConfig() {
  return {
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**", "build/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "start": {
        "dependsOn": ["build"]
      },
      "test": {
        "dependsOn": ["build"],
        "outputs": ["coverage/**"],
        "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
      },
      "lint": {},
      "clean": {
        "cache": false
      }
    }
  };
}

/**
 * Load project configuration
 * @returns {Object} - Project configuration
 */
function loadProjectConfig() {
  if (fs.existsSync(projectConfigFile)) {
    try {
      return JSON.parse(fs.readFileSync(projectConfigFile, 'utf8'));
    } catch (error) {
      console.error('Failed to load project configuration:', error);
      return {};
    }
  }
  
  return {};
}

/**
 * Save Turborepo configuration
 * @param {Object} config - Turborepo configuration
 */
function saveTurboConfig(config) {
  fs.writeFileSync(turboConfigFile, JSON.stringify(config, null, 2));
  console.log('Updated turbo.json');
}

/**
 * Optimize Turborepo configuration based on project scale
 * @param {string} projectSize - Project scale
 * @param {Object} turboConfig - Turborepo configuration
 * @returns {Object} - Optimized Turborepo configuration
 */
function optimizeForProjectSize(projectSize, turboConfig) {
  const config = { ...turboConfig };
  
  switch (projectSize) {
    case 'small':
      // Optimization for small projects
      config.pipeline.build.outputs = ["dist/**"];
      // Simplify cache settings
      delete config.pipeline.test.inputs;
      break;
      
    case 'medium':
      // Optimization for medium projects (use default settings)
      break;
      
    case 'large':
      // Optimization for large projects
      // More detailed cache settings
      config.pipeline.build.inputs = ["src/**", "package.json"];
      config.pipeline.test.inputs = [
        "src/**/*.tsx", 
        "src/**/*.ts", 
        "test/**/*.ts", 
        "test/**/*.tsx",
        "**/*.json"
      ];
      // Additional tasks
      config.pipeline.typecheck = {
        dependsOn: ["^build"],
        inputs: ["src/**/*.tsx", "src/**/*.ts"]
      };
      break;
  }
  
  return config;
}

/**
 * Optimize Turborepo configuration based on build performance
 * @param {boolean} optimizeForSpeed - Prioritize speed optimization
 * @param {Object} turboConfig - Turborepo configuration
 * @returns {Object} - Optimized Turborepo configuration
 */
function optimizeForPerformance(optimizeForSpeed, turboConfig) {
  const config = { ...turboConfig };
  
  if (optimizeForSpeed) {
    // Speed-focused optimization
    // Maximize parallel execution
    config.pipeline.build.dependsOn = ["^build"];
    // Aggressive caching
    if (!config.pipeline.build.inputs) {
      config.pipeline.build.inputs = ["src/**", "package.json"];
    }
  } else {
    // Stability-focused optimization
    // More conservative dependencies
    config.pipeline.build.dependsOn = ["^build", "lint"];
    // More strict cache invalidation
    config.pipeline.dev.cache = false;
  }
  
  return config;
}

/**
 * Optimize Turborepo configuration based on module structure
 * @param {string[]} modules - Module list
 * @param {Object} turboConfig - Turborepo configuration
 * @returns {Object} - Optimized Turborepo configuration
 */
function optimizeForModules(modules, turboConfig) {
  const config = { ...turboConfig };
  
  // Module-specific task settings
  if (modules.length > 3) {
    // For projects with many modules, define more detailed tasks
    config.pipeline = {
      ...config.pipeline,
      // Common tasks for all modules
      "build": {
        dependsOn: ["^build"],
        outputs: ["dist/**", ".next/**", "build/**"]
      },
      // API gateway specific tasks
      "api-gateway#build": {
        dependsOn: ["^build"],
        outputs: ["dist/**"]
      },
      // Frontend specific tasks
      "frontend#build": {
        dependsOn: ["^build", "sync-assets"],
        outputs: ["dist/**", ".next/**", "build/**"]
      }
    };
  }
  
  return config;
}

/**
 * Optimize cache settings
 * @param {string} cacheStrategy - Cache strategy
 * @param {Object} turboConfig - Turborepo configuration
 * @returns {Object} - Optimized Turborepo configuration
 */
function optimizeCacheStrategy(cacheStrategy, turboConfig) {
  const config = { ...turboConfig };
  
  switch (cacheStrategy) {
    case 'aggressive':
      // Aggressive caching strategy
      config.pipeline.build.inputs = ["src/**", "package.json"];
      config.pipeline.test.inputs = ["src/**", "test/**", "package.json"];
      break;
      
    case 'balanced':
      // Balanced caching strategy (default)
      break;
      
    case 'conservative':
      // Conservative caching strategy
      // Minimize cache usage
      config.pipeline.build.cache = false;
      config.pipeline.test.cache = false;
      break;
  }
  
  return config;
}

/**
 * Optimize Turborepo configuration
 */
async function optimizeTurbo() {
  console.log('Starting Turborepo configuration optimization');
  
  // Load current configuration
  let turboConfig = loadTurboConfig();
  const projectConfig = loadProjectConfig();
  
  // Project scale
  const projectSize = await askQuestion(
    'Select project scale',
    'medium',
    ['small', 'medium', 'large']
  );
  
  // Performance optimization approach
  const optimizeForSpeed = await askYesNo(
    'Prioritize build speed? (No for stability priority)',
    true
  );
  
  // Cache strategy
  const cacheStrategy = await askQuestion(
    'Select cache strategy',
    'balanced',
    ['aggressive', 'balanced', 'conservative']
  );
  
  // Module structure
  const modules = projectConfig.modules || 
    await askMultipleChoice(
      'Select modules included in the project',
      ['api-gateway', 'auth', 'module-a', 'module-b', 'module-c'],
      ['api-gateway', 'auth', 'module-a', 'module-b']
    );
  
  // Additional tasks
  const additionalTasks = await askMultipleChoice(
    'Select additional tasks',
    ['typecheck', 'format', 'deploy', 'storybook', 'e2e'],
    []
  );
  
  // Configuration optimization
  turboConfig = optimizeForProjectSize(projectSize, turboConfig);
  turboConfig = optimizeForPerformance(optimizeForSpeed, turboConfig);
  turboConfig = optimizeForModules(modules, turboConfig);
  turboConfig = optimizeCacheStrategy(cacheStrategy, turboConfig);
  
  // Configure additional tasks
  additionalTasks.forEach(task => {
    switch (task) {
      case 'typecheck':
        turboConfig.pipeline.typecheck = {
          dependsOn: [],
          inputs: ["src/**/*.tsx", "src/**/*.ts", "tsconfig.json"]
        };
        break;
        
      case 'format':
        turboConfig.pipeline.format = {
          outputs: [],
          cache: false
        };
        break;
        
      case 'deploy':
        turboConfig.pipeline.deploy = {
          dependsOn: ["build", "test", "lint"],
          outputs: []
        };
        break;
        
      case 'storybook':
        turboConfig.pipeline.storybook = {
          dependsOn: ["^build"],
          outputs: ["storybook-static/**"]
        };
        break;
        
      case 'e2e':
        turboConfig.pipeline["e2e"] = {
          dependsOn: ["^build"],
          outputs: ["cypress/videos/**", "cypress/screenshots/**"]
        };
        break;
    }
  });
  
  // Configuration summary
  console.log('\nOptimized Turborepo configuration summary:');
  console.log(`Project scale: ${projectSize}`);
  console.log(`Optimization approach: ${optimizeForSpeed ? 'Speed priority' : 'Stability priority'}`);
  console.log(`Cache strategy: ${cacheStrategy}`);
  console.log(`Modules: ${modules.join(', ')}`);
  console.log(`Additional tasks: ${additionalTasks.length > 0 ? additionalTasks.join(', ') : 'None'}`);
  
  const confirm = await askYesNo('\nUpdate turbo.json with this configuration?');
  if (!confirm) {
    console.log('Turborepo configuration optimization cancelled');
    rl.close();
    return;
  }
  
  // Save configuration
  saveTurboConfig(turboConfig);
  
  console.log('\nTurborepo configuration optimization completed');
  console.log('\nTo use the optimized Turborepo:');
  console.log('1. Run pnpm build to check build performance');
  console.log('2. Run pnpm turbo run build --dry to verify the dependency graph');
  
  rl.close();
}

// When script is executed directly
if (require.main === module) {
  optimizeTurbo().catch(err => {
    console.error('Error occurred during Turborepo configuration optimization:', err);
    process.exit(1);
  });
}

module.exports = optimizeTurbo;

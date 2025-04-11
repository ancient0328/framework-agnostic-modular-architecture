/**
 * Configuration management module for msyn
 * 
 * Features:
 * - Interactive configuration wizard
 * - Loading and saving configuration
 * - Configuration validation
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { t, setLanguage } = require('./i18n');

// Configuration file path
const CONFIG_FILE = path.join(process.cwd(), '.msyn.json');

// Default configuration
const DEFAULT_CONFIG = {
  version: '1.0.0',
  language: 'en', // Default language is English
  sourceDir: 'assets/images',
  optimizedDir: 'assets/images-optimized',
  modules: [
    {
      name: 'dashboard/web-svelte',
      targetDir: 'static/images',
      enabled: true
    },
    {
      name: 'dashboard/web-nextjs',
      targetDir: 'public/images',
      enabled: true
    },
    {
      name: 'dashboard/mobile-svelte',
      targetDir: 'static/images',
      enabled: true
    },
    {
      name: 'dashboard/mobile-reactn',
      targetDir: 'src/assets/images',
      enabled: true
    },
    {
      name: 'dashboard/mobile-flutter',
      targetDir: 'assets/images',
      enabled: true
    },
    {
      name: 'modules/ohr/frontend/web',
      targetDir: 'public/images',
      enabled: true
    },
    {
      name: 'modules/ohr/frontend/mobile',
      targetDir: 'assets/images',
      enabled: true
    },
    {
      name: 'modules/chat/frontend/web',
      targetDir: 'public/images',
      enabled: true
    },
    {
      name: 'modules/chat/frontend/mobile',
      targetDir: 'assets/images',
      enabled: true
    }
  ],
  options: {
    autoOptimize: true,
    watchDelay: 2000
  }
};

/**
 * Load configuration from file
 * @returns {Object} Configuration object
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      const config = JSON.parse(configData);
      
      // Set language from config
      if (config.language) {
        setLanguage(config.language);
      }
      
      return config;
    }
  } catch (error) {
    console.error(chalk.red(t('configLoadError', error.message)));
  }
  
  return DEFAULT_CONFIG;
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 */
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log(chalk.green(t('configSaved', CONFIG_FILE)));
  } catch (error) {
    console.error(chalk.red(t('configSaveError', error.message)));
  }
}

/**
 * Run the configuration wizard
 */
async function runConfigWizard() {
  const config = loadConfig();
  setLanguage(config.language || 'en');
  
  console.log(chalk.blue(t('configWelcome')));
  console.log('');
  
  // Language setting
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: t('languageSelect'),
      choices: [
        { name: 'English', value: 'en' },
        { name: '日本語', value: 'ja' }
      ],
      default: config.language || 'en'
    }
  ]);
  
  // Apply language change immediately if changed
  if (language !== config.language) {
    setLanguage(language);
  }
  
  // Source directory setting
  const { sourceDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'sourceDir',
      message: t('configSourceDir'),
      default: config.sourceDir
    }
  ]);
  
  // Optimized directory setting
  const { optimizedDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'optimizedDir',
      message: t('configOptimizedDir'),
      default: config.optimizedDir
    }
  ]);
  
  // Auto-optimize setting
  const { autoOptimize } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'autoOptimize',
      message: t('configAutoOptimize'),
      default: config.options.autoOptimize
    }
  ]);
  
  // Watch delay setting
  const { watchDelay } = await inquirer.prompt([
    {
      type: 'input',
      name: 'watchDelay',
      message: t('configWatchDelay'),
      default: config.options.watchDelay,
      validate: (value) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num > 0 ? true : 'Please enter a positive integer';
      },
      filter: (value) => parseInt(value, 10)
    }
  ]);
  
  // Module settings
  console.log(chalk.blue('\n' + t('configModuleSettings')));
  
  const moduleChoices = config.modules.map(module => ({
    name: `${module.name} → ${module.targetDir}`,
    value: module.name,
    checked: module.enabled
  }));
  
  const { selectedModules } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedModules',
      message: t('configSelectModules'),
      choices: moduleChoices
    }
  ]);
  
  // Adding new modules
  const { addNewModule } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addNewModule',
      message: t('configAddNewModule'),
      default: false
    }
  ]);
  
  let newModules = [];
  
  if (addNewModule) {
    let addMore = true;
    
    while (addMore) {
      const { moduleName, targetDir } = await inquirer.prompt([
        {
          type: 'input',
          name: 'moduleName',
          message: t('configModuleName'),
          validate: (value) => value.trim() !== '' ? true : 'Please enter a name'
        },
        {
          type: 'input',
          name: 'targetDir',
          message: t('configTargetDir'),
          validate: (value) => value.trim() !== '' ? true : 'Please enter a directory'
        }
      ]);
      
      newModules.push({
        name: moduleName,
        targetDir: targetDir,
        enabled: true
      });
      
      const { continueAdding } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAdding',
          message: t('configAddMore'),
          default: false
        }
      ]);
      
      addMore = continueAdding;
    }
  }
  
  // Update module settings
  const updatedModules = config.modules.map(module => ({
    ...module,
    enabled: selectedModules.includes(module.name)
  }));
  
  // Add new modules
  const allModules = [...updatedModules, ...newModules];
  
  // Create new configuration
  const newConfig = {
    ...config,
    language,
    sourceDir,
    optimizedDir,
    modules: allModules,
    options: {
      ...config.options,
      autoOptimize,
      watchDelay
    }
  };
  
  // Save configuration
  saveConfig(newConfig);
  
  console.log(chalk.green('\n' + t('configComplete')));
  console.log(t('configStartCommand'));
  console.log(chalk.cyan('  msyn sync'));
  console.log(t('configWatchCommand'));
  console.log(chalk.cyan('  msyn watch'));
}

/**
 * Display current configuration
 */
function listConfig() {
  const config = loadConfig();
  
  console.log(chalk.blue(t('configCurrent')));
  console.log(chalk.cyan(t('configSourceDirDisplay', config.sourceDir)));
  console.log(chalk.cyan(t('configOptimizedDirDisplay', config.optimizedDir)));
  console.log(chalk.cyan(t('configAutoOptimizeDisplay', config.options.autoOptimize ? 'Enabled' : 'Disabled')));
  console.log(chalk.cyan(t('configWatchDelayDisplay', config.options.watchDelay)));
  
  console.log(chalk.blue('\n' + t('configModulesDisplay')));
  config.modules.forEach(module => {
    const status = module.enabled 
      ? chalk.green(t('configModuleEnabled')) 
      : chalk.gray(t('configModuleDisabled'));
    console.log(t('configModuleStatus', status, module.name, module.targetDir));
  });
}

/**
 * Reset configuration to defaults
 */
function resetConfig() {
  saveConfig(DEFAULT_CONFIG);
  console.log(chalk.green(t('configReset')));
}

/**
 * Determine language based on various sources
 * @param {string} cliLang - Language from command line
 * @returns {string} - Determined language code
 */
function determineLanguage(cliLang) {
  // Environment variable
  if (process.env.MSYN_LANG && ['ja', 'en'].includes(process.env.MSYN_LANG)) {
    return process.env.MSYN_LANG;
  }
  
  // Command line argument
  if (cliLang && ['ja', 'en'].includes(cliLang)) {
    return cliLang;
  }
  
  // Configuration file
  const config = loadConfig();
  if (config.language && ['ja', 'en'].includes(config.language)) {
    return config.language;
  }
  
  // Default
  return 'en';
}

module.exports = {
  configManager: {
    loadConfig,
    saveConfig,
    runConfigWizard,
    listConfig,
    resetConfig,
    determineLanguage
  }
};

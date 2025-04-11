#!/usr/bin/env node

/**
 * msyn - Module synchronization tool for Framework-Agnostic Modular Architecture (FAMA)
 * 
 * A comprehensive asset management and synchronization tool
 * for multi-framework, modular monolith projects
 */

const { program } = require('commander');
const path = require('path');
const { configManager } = require('../lib/config-manager');
const { syncAssets, watchAssets } = require('../lib/sync-assets');
const { optimizeAllSvg } = require('../lib/optimize-svg');
const { t, setLanguage, getCurrentLanguageName, supportedLanguages } = require('../lib/i18n');

// Load package.json for version info
const packageJson = require('../package.json');

// Global language option
program
  .version(packageJson.version || '1.0.0')
  .option('-l, --lang <language>', 'Specify language (en/ja)')
  .hook('preAction', (thisCommand, actionCommand) => {
    const options = actionCommand.opts();
    const lang = configManager.determineLanguage(options.lang);
    setLanguage(lang);
  });

// Configuration command
program
  .command('config')
  .description('Manage configuration')
  .option('--list', 'List current configuration')
  .option('--reset', 'Reset configuration to defaults')
  .action(async (options) => {
    if (options.list) {
      await configManager.listConfig();
    } else if (options.reset) {
      await configManager.resetConfig();
    } else {
      await configManager.runConfigWizard();
    }
  });

// Language command
program
  .command('lang')
  .description('Change language setting')
  .argument('[language]', 'Language code (en/ja)')
  .action(async (language) => {
    const config = configManager.loadConfig();
    
    if (language) {
      // Direct language specification
      if (supportedLanguages.includes(language)) {
        config.language = language;
        configManager.saveConfig(config);
        setLanguage(language);
        
        // Display success message in the selected language
        if (language === 'ja') {
          console.log('✅ 言語を日本語に変更しました');
        } else {
          console.log('✅ Language changed to English');
        }
      } else {
        // Error message in both languages for clarity
        console.error('❌ Invalid language: ' + language);
        console.error('❌ 無効な言語です: ' + language);
        console.error('Valid values / 有効な値: ' + supportedLanguages.join(', '));
      }
    } else {
      // Interactive language selection
      const inquirer = require('inquirer');
      const { selectedLang } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedLang',
          message: 'Select language / 使用言語を選択してください:',
          choices: [
            { name: 'English', value: 'en' },
            { name: '日本語', value: 'ja' }
          ],
          default: config.language || 'en'
        }
      ]);
      
      config.language = selectedLang;
      configManager.saveConfig(config);
      setLanguage(selectedLang);
      
      // Success message in the selected language
      if (selectedLang === 'ja') {
        console.log('✅ 言語を日本語に変更しました');
      } else {
        console.log('✅ Language changed to English');
      }
    }
  });

// Sync command
program
  .command('sync')
  .description('Synchronize assets')
  .option('-f, --force', 'Force overwrite')
  .option('-v, --verbose', 'Show detailed output')
  .option('-d, --dry-run', 'Simulate without making changes')
  .option('-m, --modules <modules>', 'Specify target modules (comma-separated)')
  .option('--no-optimize', 'Disable SVG optimization')
  .action(async (options) => {
    await syncAssets(options);
  });

// Watch command
program
  .command('watch')
  .description('Watch for asset changes and sync automatically')
  .option('-f, --force', 'Force overwrite')
  .option('-v, --verbose', 'Show detailed output')
  .option('-m, --modules <modules>', 'Specify target modules (comma-separated)')
  .option('--no-optimize', 'Disable SVG optimization')
  .action(async (options) => {
    await watchAssets(options);
  });

// Optimize command
program
  .command('optimize')
  .description('Optimize SVG files')
  .option('-f, --force', 'Force overwrite existing optimized files')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (options) => {
    await optimizeAllSvg(options);
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command specified
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

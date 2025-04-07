#!/usr/bin/env node

/**
 * create-cmm-template
 * Containerized Modular Monolith Architecture Template Creation Tool
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const { execSync } = require('child_process');

// Version information
const packageJson = require('./package.json');
const version = packageJson.version;

// Template path
const templatesDir = path.join(__dirname);

// Command line options
const program = new commander.Command(packageJson.name)
  .version(version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--template <template-name>', 'Specify template (pnpm-turbo, flexible)', 'flexible')
  .option('--use-npm', 'Use npm')
  .option('--use-yarn', 'Use yarn')
  .option('--use-pnpm', 'Use pnpm')
  .option('--skip-install', 'Skip package installation')
  .option('--verbose', 'Show detailed logs')
  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    ${chalk.green('create-cmm-template my-app')} - Create a new project`);
    console.log(`    ${chalk.green('create-cmm-template my-app --template=pnpm-turbo')} - Select template using pnpm and Turborepo`);
    console.log();
  })
  .parse(process.argv);

const options = program.opts();

// If project name is not specified
if (typeof projectName === 'undefined') {
  console.error('Please specify the project name:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
  console.log();
  console.log('Example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-app')}`);
  process.exit(1);
}

// Project directory path
const projectPath = path.resolve(projectName);
const projectDirName = path.basename(projectPath);

// Available templates
const validTemplates = ['pnpm-turbo', 'flexible'];

// Template validation
if (!validTemplates.includes(options.template)) {
  console.error(`Template "${options.template}" does not exist.`);
  console.log(`Available templates: ${validTemplates.join(', ')}`);
  process.exit(1);
}

// Main function
async function run() {
  try {
    // Project creation confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create project in ${chalk.cyan(projectDirName)} directory?`,
        default: true
      }
    ]);

    if (!confirm) {
      console.log('Project creation cancelled.');
      process.exit(0);
    }

    // Package manager selection
    let packageManager = 'npm';
    if (options.usePnpm) {
      packageManager = 'pnpm';
    } else if (options.useYarn) {
      packageManager = 'yarn';
    } else if (options.template === 'pnpm-turbo') {
      packageManager = 'pnpm';
    } else if (!options.useNpm) {
      const { manager } = await inquirer.prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'Select a package manager:',
          choices: [
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
            { name: 'pnpm', value: 'pnpm' }
          ],
          default: 'npm'
        }
      ]);
      packageManager = manager;
    }

    // Template path
    const templatePath = path.join(templatesDir, `cmm-template-${options.template}`);

    // Create project directory
    console.log(`🚀 Creating ${chalk.cyan(projectDirName)} project...`);
    fs.ensureDirSync(projectName);

    // Copy template
    const spinner = ora('Copying template...').start();
    fs.copySync(templatePath, projectPath);
    spinner.succeed('Template copied.');

    // Update package.json
    const pkgJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = require(pkgJsonPath);
      pkgJson.name = projectDirName;
      pkgJson.version = '0.1.0';
      
      // Warning for using non-pnpm with pnpm-turbo template
      if (options.template === 'pnpm-turbo' && packageManager !== 'pnpm') {
        console.warn(chalk.yellow('Warning: pnpm-turbo template is recommended to be used with pnpm.'));
      }
      
      // Package manager configuration
      if (options.template === 'flexible') {
        pkgJson.packageManager = `${packageManager} || npm || yarn || pnpm`;
      } else if (packageManager === 'pnpm') {
        pkgJson.packageManager = 'pnpm@8.6.0';
      }
      
      fs.writeFileSync(
        pkgJsonPath,
        JSON.stringify(pkgJson, null, 2) + '\n'
      );
    }

    // Install dependencies
    if (!options.skipInstall) {
      console.log();
      console.log('📦 Installing dependencies...');
      
      const installSpinner = ora('Installing packages...').start();
      
      try {
        const installCmd = getInstallCommand(packageManager);
        execSync(installCmd, { cwd: projectPath, stdio: options.verbose ? 'inherit' : 'pipe' });
        installSpinner.succeed('Packages installed.');
      } catch (error) {
        installSpinner.fail('Failed to install packages.');
        console.error(chalk.red('Error:'), error.message);
        console.log();
        console.log(chalk.yellow('Please install manually:'));
        console.log(`  cd ${projectDirName}`);
        console.log(`  ${getInstallCommand(packageManager)}`);
      }
    }

    // Run initialization script
    if (fs.existsSync(path.join(projectPath, 'scripts', 'init-project.js'))) {
      console.log();
      console.log('🔧 Initializing project...');
      
      const { runInit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'runInit',
          message: 'Run initialization script?',
          default: true
        }
      ]);
      
      if (runInit) {
        try {
          const initCmd = `${packageManager} run init`;
          execSync(initCmd, { cwd: projectPath, stdio: 'inherit' });
        } catch (error) {
          console.error(chalk.red('Error:'), 'Failed to run initialization script.');
          console.log(chalk.yellow('Please run manually:'));
          console.log(`  cd ${projectDirName}`);
          console.log(`  ${packageManager} run init`);
        }
      }
    }

    // Completion message
    console.log();
    console.log(`🎉 ${chalk.green('Success!')} ${chalk.cyan(projectDirName)} project has been created.`);
    console.log();
    console.log('Next steps:');
    console.log(`  ${chalk.cyan('cd')} ${projectDirName}`);
    
    if (options.skipInstall) {
      console.log(`  ${chalk.cyan(getInstallCommand(packageManager))}`);
    }
    
    console.log(`  ${chalk.cyan(`${packageManager} run dev`)}`);
    console.log();
    console.log('For detailed documentation, please refer to:');
    console.log(`  ${chalk.cyan('https://github.com/ancient0328/containerized-modular-monolith')}`);
    console.log();

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Get installation command based on package manager
 * @param {string} packageManager - Package manager
 * @returns {string} - Installation command
 */
function getInstallCommand(packageManager) {
  switch (packageManager) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'npm':
    default:
      return 'npm install';
  }
}

// Run script
run();

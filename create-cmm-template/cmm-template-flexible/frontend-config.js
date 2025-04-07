#!/usr/bin/env node

/**
 * Frontend Framework Configuration Script
 * Manages the frontend framework configuration used in the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { getPackageManagerConfig } = require('./package-manager');

// Supported frontend frameworks
const FRONTEND_FRAMEWORKS = {
  react: {
    name: 'React',
    createCmd: {
      npm: 'npx create-react-app',
      yarn: 'yarn create react-app',
      pnpm: 'pnpm create react-app'
    },
    devServer: {
      port: 3000,
      command: 'start'
    },
    buildCommand: 'build',
    dependencies: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  vue: {
    name: 'Vue.js',
    createCmd: {
      npm: 'npx @vue/cli create',
      yarn: 'yarn create @vue/app',
      pnpm: 'pnpm create vue@latest'
    },
    devServer: {
      port: 8080,
      command: 'serve'
    },
    buildCommand: 'build',
    dependencies: [
      'vue',
      'vue-router',
      'pinia'
    ]
  },
  svelte: {
    name: 'Svelte',
    createCmd: {
      npm: 'npx degit sveltejs/template',
      yarn: 'npx degit sveltejs/template',
      pnpm: 'pnpm dlx degit sveltejs/template'
    },
    devServer: {
      port: 5000,
      command: 'dev'
    },
    buildCommand: 'build',
    dependencies: [
      'svelte',
      'svelte-navigator'
    ]
  },
  angular: {
    name: 'Angular',
    createCmd: {
      npm: 'npx @angular/cli new',
      yarn: 'yarn dlx @angular/cli new',
      pnpm: 'pnpm dlx @angular/cli new'
    },
    devServer: {
      port: 4200,
      command: 'serve'
    },
    buildCommand: 'build',
    dependencies: [
      '@angular/core',
      '@angular/router',
      '@angular/forms'
    ]
  },
  nextjs: {
    name: 'Next.js',
    createCmd: {
      npm: 'npx create-next-app',
      yarn: 'yarn create next-app',
      pnpm: 'pnpm create next-app'
    },
    devServer: {
      port: 3000,
      command: 'dev'
    },
    buildCommand: 'build',
    dependencies: [
      'next',
      'react',
      'react-dom'
    ]
  }
};

/**
 * Select frontend framework interactively
 */
async function selectFrontendFramework() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('Select a frontend framework:');
    
    Object.entries(FRONTEND_FRAMEWORKS).forEach(([key, framework], index) => {
      console.log(`${index + 1}. ${framework.name}`);
    });
    
    rl.question('Selection (default: React): ', (answer) => {
      rl.close();
      
      const selection = answer.trim();
      if (!selection) {
        return resolve('react');
      }
      
      const frameworks = Object.keys(FRONTEND_FRAMEWORKS);
      const index = parseInt(selection, 10) - 1;
      
      if (index >= 0 && index < frameworks.length) {
        return resolve(frameworks[index]);
      }
      
      return resolve('react');
    });
  });
}

/**
 * Save selected frontend framework configuration
 */
function saveFrontendConfig(key) {
  const config = {
    key,
    ...FRONTEND_FRAMEWORKS[key]
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), '.frontend-framework.json'),
    JSON.stringify(config, null, 2)
  );
  
  return config;
}

/**
 * Get current frontend framework configuration
 */
function getFrontendConfig() {
  const configPath = path.join(process.cwd(), '.frontend-framework.json');
  
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  
  // Default is React
  return {
    key: 'react',
    ...FRONTEND_FRAMEWORKS.react
  };
}

/**
 * Create a new frontend project
 */
function createFrontendProject(framework, projectPath, options = {}) {
  const packageManager = getPackageManagerConfig();
  const createCommand = framework.createCmd[packageManager.name];
  
  if (!createCommand) {
    throw new Error(`No method defined to create a ${framework.name} project with ${packageManager.name}`);
  }
  
  const projectName = path.basename(projectPath);
  const command = `${createCommand} ${projectName} ${options.args || ''}`;
  
  console.log(`Creating frontend project: ${command}`);
  
  try {
    execSync(command, {
      cwd: path.dirname(projectPath),
      stdio: 'inherit'
    });
    
    console.log(`${framework.name} project successfully created: ${projectPath}`);
    return true;
  } catch (error) {
    console.error(`Error occurred during project creation: ${error.message}`);
    return false;
  }
}

// Process based on command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--select')) {
    const selected = await selectFrontendFramework();
    const config = saveFrontendConfig(selected);
    console.log(`Frontend framework set to ${config.name}`);
    return config;
  }
  
  if (args.includes('--get')) {
    const config = getFrontendConfig();
    console.log(JSON.stringify(config, null, 2));
    return config;
  }
  
  if (args.includes('--create')) {
    const frameworkArg = args[args.indexOf('--create') + 1];
    const pathArg = args[args.indexOf('--create') + 2];
    
    if (!pathArg) {
      console.error('Please specify a project path');
      process.exit(1);
    }
    
    const framework = frameworkArg && FRONTEND_FRAMEWORKS[frameworkArg]
      ? FRONTEND_FRAMEWORKS[frameworkArg]
      : getFrontendConfig();
    
    return createFrontendProject(framework, pathArg);
  }
  
  // Default is to return current configuration
  return getFrontendConfig();
}

// Export for module usage
module.exports = {
  selectFrontendFramework,
  saveFrontendConfig,
  getFrontendConfig,
  createFrontendProject,
  FRONTEND_FRAMEWORKS
};

// When executed directly from command line
if (require.main === module) {
  main().catch(console.error);
}

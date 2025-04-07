#!/usr/bin/env node

/**
 * Package Manager Detection and Selection Script
 * Helps maintain consistent package manager usage within the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Detectable package managers
const PACKAGE_MANAGERS = {
  npm: {
    lockfile: 'package-lock.json',
    installCmd: 'npm install',
    addCmd: 'npm install',
    addDevCmd: 'npm install --save-dev',
    runCmd: 'npm run',
    workspaceFlag: '--workspace',
    workspaceRoot: '-w'
  },
  yarn: {
    lockfile: 'yarn.lock',
    installCmd: 'yarn',
    addCmd: 'yarn add',
    addDevCmd: 'yarn add --dev',
    runCmd: 'yarn',
    workspaceFlag: 'workspace',
    workspaceRoot: '-W'
  },
  pnpm: {
    lockfile: 'pnpm-lock.yaml',
    installCmd: 'pnpm install',
    addCmd: 'pnpm add',
    addDevCmd: 'pnpm add -D',
    runCmd: 'pnpm',
    workspaceFlag: '--filter',
    workspaceRoot: '-w'
  }
};

/**
 * Detect current package manager
 */
function detectPackageManager() {
  // Check for lockfiles
  for (const [name, config] of Object.entries(PACKAGE_MANAGERS)) {
    if (fs.existsSync(path.join(process.cwd(), config.lockfile))) {
      return name;
    }
  }

  // Check for globally installed package managers
  for (const name of Object.keys(PACKAGE_MANAGERS)) {
    try {
      execSync(`${name} --version`, { stdio: 'ignore' });
      return name;
    } catch (e) {
      // Command not found, try next
    }
  }

  // Default to npm
  return 'npm';
}

/**
 * Select package manager interactively
 */
async function selectPackageManager() {
  const detected = detectPackageManager();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(
      `Select a package manager (detected: ${detected}):\n` +
      `1. npm\n` +
      `2. yarn\n` +
      `3. pnpm\n` +
      `Selection (default: ${detected}): `,
      (answer) => {
        rl.close();
        
        const selection = answer.trim();
        if (!selection) {
          return resolve(detected);
        }
        
        switch (selection) {
          case '1': return resolve('npm');
          case '2': return resolve('yarn');
          case '3': return resolve('pnpm');
          default: return resolve(detected);
        }
      }
    );
  });
}

/**
 * Save selected package manager configuration
 */
function savePackageManagerConfig(name) {
  const config = {
    name,
    ...PACKAGE_MANAGERS[name]
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), '.package-manager.json'),
    JSON.stringify(config, null, 2)
  );
  
  return config;
}

/**
 * Get current package manager configuration
 */
function getPackageManagerConfig() {
  const configPath = path.join(process.cwd(), '.package-manager.json');
  
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  
  const detected = detectPackageManager();
  return {
    name: detected,
    ...PACKAGE_MANAGERS[detected]
  };
}

// Process based on command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--select')) {
    const selected = await selectPackageManager();
    const config = savePackageManagerConfig(selected);
    console.log(`Package manager set to ${selected}`);
    return config;
  }
  
  if (args.includes('--get')) {
    const config = getPackageManagerConfig();
    console.log(JSON.stringify(config, null, 2));
    return config;
  }
  
  // Default is to return current configuration
  return getPackageManagerConfig();
}

// Export for module usage
module.exports = {
  detectPackageManager,
  selectPackageManager,
  savePackageManagerConfig,
  getPackageManagerConfig
};

// When executed directly from command line
if (require.main === module) {
  main().catch(console.error);
}

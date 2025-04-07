#!/usr/bin/env node

/**
 * Project Record Manager Setup for CMM
 * 
 * This script installs and configures Project Record Manager for a CMM project.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Detect package manager
function detectPackageManager() {
  if (fs.existsSync('./pnpm-lock.yaml')) {
    return 'pnpm';
  } else if (fs.existsSync('./yarn.lock')) {
    return 'yarn';
  } else {
    return 'npm';
  }
}

// Main function
async function main() {
  try {
    const packageManager = detectPackageManager();
    console.log(`Detected package manager: ${packageManager}`);
    
    // Install command based on package manager
    const installCmd = packageManager === 'npm' ? 'npm install' : 
                       packageManager === 'yarn' ? 'yarn add' : 'pnpm add';
    
    // Install Project Record Manager
    console.log('Installing Project Record Manager...');
    execSync(`${installCmd} project-record-manager`, { stdio: 'inherit' });
    
    // Update package.json scripts
    const packageJsonPath = path.resolve('./package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.prm = 'project-record-manager';
    packageJson.scripts['prm:create'] = 'project-record-manager create';
    packageJson.scripts['prm:config'] = 'project-record-manager config';
    packageJson.scripts['prm:setup-cmm'] = 'project-record-manager setup-cmm';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Run CMM setup
    console.log('Setting up Project Record Manager for CMM...');
    const runCmd = packageManager === 'npm' ? 'npx' : packageManager;
    execSync(`${runCmd} project-record-manager setup-cmm`, { stdio: 'inherit' });
    
    console.log('\n✅ Project Record Manager setup complete!');
    console.log('You can now use the following commands:');
    console.log(`  ${packageManager} run prm:create    - Create a new project record`);
    console.log(`  ${packageManager} run prm:config    - Configure Project Record Manager`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();

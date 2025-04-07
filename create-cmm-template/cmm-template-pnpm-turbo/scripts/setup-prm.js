#!/usr/bin/env node

/**
 * Project Record Manager Setup for CMM
 * 
 * This script installs and configures Project Record Manager for a CMM project.
 * Optimized for pnpm and Turborepo.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Main function
async function main() {
  try {
    console.log('Setting up Project Record Manager for CMM with pnpm and Turborepo...');
    
    // Install Project Record Manager
    console.log('Installing Project Record Manager...');
    execSync('pnpm add -w project-record-manager', { stdio: 'inherit' });
    
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
    execSync('pnpm project-record-manager setup-cmm', { stdio: 'inherit' });
    
    // Update turbo.json to include prm commands
    const turboJsonPath = path.resolve('./turbo.json');
    if (fs.existsSync(turboJsonPath)) {
      const turboJson = JSON.parse(fs.readFileSync(turboJsonPath, 'utf8'));
      
      // Add prm pipeline
      turboJson.pipeline = turboJson.pipeline || {};
      turboJson.pipeline.prm = {
        cache: false,
        dependsOn: []
      };
      
      fs.writeFileSync(turboJsonPath, JSON.stringify(turboJson, null, 2));
      console.log('Updated turbo.json with prm pipeline configuration');
    }
    
    console.log('\n✅ Project Record Manager setup complete!');
    console.log('You can now use the following commands:');
    console.log('  pnpm prm:create    - Create a new project record');
    console.log('  pnpm prm:config    - Configure Project Record Manager');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();

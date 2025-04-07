/**
 * Asset Synchronization Script
 * Synchronizes shared assets to each module
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const sharedAssetsDir = path.join(rootDir, 'assets');
const targetDirs = [
  path.join(rootDir, 'frontend', 'web', 'src', 'assets'),
  path.join(rootDir, 'frontend', 'mobile-svelte', 'src', 'assets'),
  path.join(rootDir, 'frontend', 'mobile-flutter', 'assets'),
  path.join(rootDir, 'modules', 'module-a', 'frontend', 'src', 'assets'),
  path.join(rootDir, 'modules', 'module-b', 'frontend', 'src', 'assets'),
];

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  modules: null,
  dryRun: false,
  fileTypes: null,
};

args.forEach(arg => {
  if (arg.startsWith('--modules=')) {
    options.modules = arg.replace('--modules=', '').split(',');
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg.startsWith('--file-types=')) {
    options.fileTypes = arg.replace('--file-types=', '').split(',');
  }
});

// Asset synchronization function
async function syncAssets() {
  console.log('🔄 Starting asset synchronization...');
  
  // Check if shared assets directory exists
  if (!fs.existsSync(sharedAssetsDir)) {
    console.error(`❌ Error: Shared assets directory not found: ${sharedAssetsDir}`);
    return;
  }

  // Process each target directory
  for (const targetDir of targetDirs) {
    // Module filtering
    if (options.modules) {
      const moduleName = targetDir.split(path.sep).find(part => part.startsWith('module-'));
      if (moduleName && !options.modules.includes(moduleName)) {
        continue;
      }
    }

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      if (options.dryRun) {
        console.log(`📝 [Dry Run] Creating directory: ${targetDir}`);
      } else {
        console.log(`📁 Creating directory: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    // Build rsync command
    let rsyncCommand = `rsync -av --delete`;
    
    // File type filtering
    if (options.fileTypes) {
      const includePatterns = options.fileTypes.map(type => `--include="*.${type}"`).join(' ');
      rsyncCommand += ` ${includePatterns} --exclude="*"`;
    }
    
    // Dry run option
    if (options.dryRun) {
      rsyncCommand += ` --dry-run`;
    }
    
    // Add source and target
    rsyncCommand += ` ${sharedAssetsDir}/ ${targetDir}/`;
    
    try {
      if (options.dryRun) {
        console.log(`📝 [Dry Run] Command to execute: ${rsyncCommand}`);
      }
      
      // Execute rsync
      const output = execSync(rsyncCommand, { encoding: 'utf8' });
      
      if (options.dryRun) {
        console.log(`📝 [Dry Run] Simulated synchronization to ${targetDir}`);
        if (output) console.log(output);
      } else {
        console.log(`✅ Synchronization to ${targetDir} completed`);
      }
    } catch (error) {
      console.error(`❌ Error: Failed to synchronize to ${targetDir}`);
      console.error(error.message);
    }
  }
  
  console.log('🎉 Asset synchronization completed');
}

// Execute script
syncAssets().catch(err => {
  console.error('❌ Unexpected error occurred:', err);
  process.exit(1);
});

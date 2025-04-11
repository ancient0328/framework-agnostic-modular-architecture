/**
 * Asset synchronization module for msyn
 * 
 * Features:
 * - Synchronization of assets from common directory to framework-specific locations
 * - Differential synchronization for performance optimization
 * - Asset version management
 * - File watching functionality
 * - SVG optimization
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chokidar = require('chokidar');
const chalk = require('chalk');
const { configManager } = require('./config-manager');
const { optimizeSvg } = require('./optimize-svg');
const { t } = require('./i18n');

// Version information file
const ASSET_VERSION_FILE = '.asset-versions.json';

/**
 * Asset synchronization function
 * @param {Object} options - Command line options
 */
async function syncAssets(options = {}) {
  const config = configManager.loadConfig();
  
  // Merge command line options with configuration
  const syncOptions = {
    dryRun: options.dryRun || false,
    verbose: options.verbose || false,
    force: options.force || false,
    optimize: options.optimize !== false && config.options.autoOptimize,
    modules: options.modules ? options.modules.split(',') : null
  };
  
  console.log(chalk.blue(t('syncStart') + (syncOptions.optimize ? '' : t('syncNoOptimize'))));
  
  // Source directory
  const SOURCE_DIR = path.resolve(process.cwd(), config.sourceDir);
  
  // Optimized directory
  const OPTIMIZED_DIR = path.resolve(process.cwd(), config.optimizedDir);
  
  // Create optimized directory if it doesn't exist
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }
  
  // Load version data
  const versionData = loadVersionData();
  
  // Determine modules to synchronize
  const modulesToSync = syncOptions.modules 
    ? config.modules.filter(m => syncOptions.modules.includes(m.name) && m.enabled)
    : config.modules.filter(m => m.enabled);
  
  if (modulesToSync.length === 0) {
    console.log(chalk.yellow(t('syncNoModules')));
    return;
  }
  
  // Synchronize each module
  for (const module of modulesToSync) {
    await syncModuleAssets(module, versionData, SOURCE_DIR, OPTIMIZED_DIR, syncOptions);
  }
  
  // Save version data
  if (!syncOptions.dryRun) {
    saveVersionData(versionData);
  }
  
  console.log(chalk.green(t('syncComplete')));
}

/**
 * Get asset files with their hash values
 * @param {string} baseDir - Base directory
 * @param {string} relativePath - Relative path
 * @param {function} fileTypeFilter - File type filter function
 * @returns {Object} - Map of files and their hash values
 */
function getAssetFilesWithHash(baseDir, relativePath = '', fileTypeFilter = null) {
  const result = {};
  const currentDir = path.join(baseDir, relativePath);
  
  if (!fs.existsSync(currentDir)) {
    return result;
  }
  
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryRelativePath = path.join(relativePath, entry.name);
    
    if (entry.isDirectory()) {
      // Process subdirectories recursively
      const subDirFiles = getAssetFilesWithHash(baseDir, entryRelativePath, fileTypeFilter);
      Object.assign(result, subDirFiles);
    } else if (entry.isFile()) {
      // Apply file type filter if provided
      if (fileTypeFilter && !fileTypeFilter(entry.name)) {
        continue;
      }
      
      const filePath = path.join(baseDir, entryRelativePath);
      const fileContent = fs.readFileSync(filePath);
      const hash = crypto.createHash('md5').update(fileContent).digest('hex');
      
      result[entryRelativePath] = hash;
    }
  }
  
  return result;
}

/**
 * Load version data
 * @returns {Object} - Version data
 */
function loadVersionData() {
  const versionFilePath = path.join(process.cwd(), ASSET_VERSION_FILE);
  
  if (fs.existsSync(versionFilePath)) {
    try {
      const data = fs.readFileSync(versionFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(chalk.red(t('fileError', error.message)));
    }
  }
  
  return {};
}

/**
 * Save version data
 * @param {Object} versionData - Version data
 */
function saveVersionData(versionData) {
  const versionFilePath = path.join(process.cwd(), ASSET_VERSION_FILE);
  
  try {
    fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2), 'utf8');
  } catch (error) {
    console.error(chalk.red(t('fileError', error.message)));
  }
}

/**
 * Synchronize assets for a module
 * @param {Object} module - Module configuration
 * @param {Object} versionData - Version data
 * @param {string} sourceDir - Source directory
 * @param {string} optimizedDir - Optimized directory
 * @param {Object} options - Synchronization options
 */
async function syncModuleAssets(module, versionData, sourceDir, optimizedDir, options) {
  console.log(chalk.blue(t('syncModuleStart', module.name)));
  
  // Determine target directory
  const targetAssetDir = path.resolve(process.cwd(), module.name, module.targetDir);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetAssetDir)) {
    if (!options.dryRun) {
      fs.mkdirSync(targetAssetDir, { recursive: true });
      if (options.verbose) {
        console.log(chalk.green(t('fileCreateDir', targetAssetDir)));
      }
    } else {
      console.log(chalk.yellow(t('dryRunPrefix') + t('fileCreateDir', targetAssetDir)));
    }
  }
  
  // Get previous sync state
  const lastSyncState = versionData[module.name] || {};
  
  // Get source and target assets
  const sourceAssets = getAssetFilesWithHash(sourceDir);
  const targetAssets = getAssetFilesWithHash(targetAssetDir);
  
  // Sync counters
  let addedCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;
  let optimizedCount = 0;
  
  // Synchronize source assets to target
  for (const [relativePath, sourceHash] of Object.entries(sourceAssets)) {
    const sourcePath = path.join(sourceDir, relativePath);
    const targetPath = path.join(targetAssetDir, relativePath);
    const targetDir = path.dirname(targetPath);
    
    // Check if file needs to be updated
    const needsUpdate = !targetAssets[relativePath] || 
                        targetAssets[relativePath] !== sourceHash ||
                        options.force;
    
    if (needsUpdate) {
      // Check if it's an SVG file
      const isSvgFile = relativePath.toLowerCase().endsWith('.svg');
      
      if (!options.dryRun) {
        try {
          // Create target directory if it doesn't exist
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            if (options.verbose) {
              console.log(chalk.green(t('fileCreateDir', targetDir)));
            }
          }
          
          // Optimize SVG files if enabled
          if (isSvgFile && options.optimize) {
            const optimizedPath = path.join(optimizedDir, relativePath);
            const optimizedDir = path.dirname(optimizedPath);
            
            // Create optimized directory if it doesn't exist
            if (!fs.existsSync(optimizedDir)) {
              fs.mkdirSync(optimizedDir, { recursive: true });
            }
            
            // Optimize SVG
            await optimizeSvg(sourcePath, optimizedPath, { verbose: options.verbose });
            
            // Copy optimized SVG
            fs.copyFileSync(optimizedPath, targetPath);
            optimizedCount++;
            
            if (options.verbose) {
              console.log(chalk.green(t('fileSvgOptimized', targetPath)));
            }
          } else {
            // Copy regular file
            fs.copyFileSync(sourcePath, targetPath);
            
            if (!lastSyncState[relativePath]) {
              addedCount++;
              if (options.verbose) {
                console.log(chalk.green(t('fileAdded', targetPath)));
              }
            } else {
              updatedCount++;
              if (options.verbose) {
                console.log(chalk.green(t('fileUpdated', targetPath)));
              }
            }
          }
          
          // Update version data
          if (!versionData[module.name]) {
            versionData[module.name] = {};
          }
          versionData[module.name][relativePath] = sourceHash;
        } catch (err) {
          console.error(chalk.red(t('fileError', err.message)));
        }
      } else {
        // Dry run mode
        if (!lastSyncState[relativePath]) {
          addedCount++;
          if (options.verbose) {
            console.log(chalk.yellow(t('dryRunAdd', targetPath)));
          }
        } else {
          updatedCount++;
          if (options.verbose) {
            console.log(chalk.yellow(t('dryRunUpdate', targetPath)));
          }
        }
        
        // Count SVG optimization in dry run mode
        if (isSvgFile && options.optimize) {
          optimizedCount++;
          if (options.verbose) {
            console.log(chalk.yellow(t('dryRunOptimize', targetPath)));
          }
        }
      }
    }
  }
  
  // Remove unnecessary files
  for (const [relativePath, targetHash] of Object.entries(targetAssets)) {
    if (!sourceAssets[relativePath]) {
      const targetPath = path.join(targetAssetDir, relativePath);
      
      if (!options.dryRun) {
        try {
          fs.unlinkSync(targetPath);
          deletedCount++;
          
          // Remove from version data
          if (versionData[module.name] && versionData[module.name][relativePath]) {
            delete versionData[module.name][relativePath];
          }
          
          if (options.verbose) {
            console.log(chalk.green(t('fileDeleted', targetPath)));
          }
        } catch (err) {
          console.error(chalk.red(t('fileError', err.message)));
        }
      } else {
        deletedCount++;
        if (options.verbose) {
          console.log(chalk.yellow(t('dryRunDelete', targetPath)));
        }
      }
    }
  }
  
  // Display synchronization results
  const svgOptimizedText = optimizedCount > 0 ? t('syncSvgOptimized', optimizedCount) : '';
  console.log(chalk.green(t('syncResult', module.name, addedCount, updatedCount, deletedCount, svgOptimizedText)));
}

/**
 * Watch assets for changes
 * @param {Object} options - Watch options
 */
async function watchAssets(options = {}) {
  const config = configManager.loadConfig();
  
  // Merge command line options with configuration
  const watchOptions = {
    verbose: options.verbose || false,
    force: options.force || false,
    optimize: options.optimize !== false && config.options.autoOptimize,
    modules: options.modules ? options.modules.split(',') : null
  };
  
  // Source directory
  const sourceDir = path.resolve(process.cwd(), config.sourceDir);
  
  console.log(chalk.blue(t('watchStart') + (watchOptions.optimize ? '' : t('syncNoOptimize'))));
  console.log(chalk.cyan(t('watchDir', sourceDir)));
  console.log(chalk.yellow(t('exitCtrlC')));
  
  // Set up file watcher
  const watcher = chokidar.watch(sourceDir, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: config.options.watchDelay || 2000,
      pollInterval: 100
    }
  });
  
  // Handle file events
  watcher.on('add', filePath => {
    console.log(chalk.green(t('watchFileAdded', filePath)));
    syncAssets(watchOptions);
  });
  
  watcher.on('change', filePath => {
    console.log(chalk.blue(t('watchFileChanged', filePath)));
    syncAssets(watchOptions);
  });
  
  watcher.on('unlink', filePath => {
    console.log(chalk.yellow(t('watchFileDeleted', filePath)));
    syncAssets(watchOptions);
  });
  
  watcher.on('error', error => {
    console.error(chalk.red(t('watchError', error)));
  });
  
  // Run initial synchronization
  await syncAssets(watchOptions);
}

module.exports = {
  syncAssets,
  watchAssets
};

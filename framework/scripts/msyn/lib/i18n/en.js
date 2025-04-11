/**
 * English language messages for msyn
 */
module.exports = {
  // Common
  welcome: 'msyn - Asset Synchronization Tool for Modular Monolith',
  exitCtrlC: 'Press Ctrl+C to exit',
  
  // Config Wizard
  configWelcome: '📝 Welcome to msyn configuration wizard',
  configSourceDir: 'Specify the source directory for assets:',
  configOptimizedDir: 'Specify the output directory for optimized SVGs:',
  configAutoOptimize: 'Automatically optimize SVG files?',
  configWatchDelay: 'Specify the watch delay time (ms):',
  configModuleSettings: '📂 Module Settings',
  configSelectModules: 'Select modules to synchronize:',
  configAddNewModule: 'Add a new module?',
  configModuleName: 'Enter module name:',
  configTargetDir: 'Enter target directory:',
  configAddMore: 'Add another module?',
  configComplete: '✅ Configuration completed!',
  configStartCommand: 'You can start asset synchronization with:',
  configWatchCommand: 'Or run in watch mode:',
  
  // Language
  languageSelect: 'Select language:',
  languageChanged: '✅ Language changed to {0}',
  languageInvalid: '❌ Invalid language: {0}',
  languageValidValues: 'Valid values: ja, en',
  
  // Sync
  syncStart: '🔄 Starting asset synchronization...',
  syncNoOptimize: ' (SVG optimization disabled)',
  syncNoModules: '⚠️ No modules to synchronize',
  syncComplete: '🎉 Asset synchronization completed!',
  syncModuleStart: '📂 Starting synchronization for module \'{0}\'...',
  syncResult: '✅ Sync results for {0}: Added={1}, Updated={2}, Deleted={3}{4}',
  syncSvgOptimized: ', SVG Optimized={0}',
  
  // File Operations
  fileAdded: '➕ Added file: {0}',
  fileUpdated: '🔄 Updated file: {0}',
  fileDeleted: '➖ Deleted file: {0}',
  fileSvgOptimized: '🔧 Optimized and copied SVG: {0}',
  fileError: '❌ File operation failed: {0}',
  fileCreateDir: '📁 Creating directory: {0}',
  
  // Dry Run
  dryRunPrefix: '[DRY RUN] ',
  dryRunAdd: '➕ [DRY RUN] Will add file: {0}',
  dryRunUpdate: '🔄 [DRY RUN] Will update file: {0}',
  dryRunDelete: '➖ [DRY RUN] Will delete file: {0}',
  dryRunOptimize: '🔧 [DRY RUN] Will optimize SVG: {0}',
  
  // Watch Mode
  watchStart: '👀 Starting asset watch mode...',
  watchDir: '📂 Watching directory: {0}',
  watchFileAdded: '➕ File added: {0}',
  watchFileChanged: '🔄 File changed: {0}',
  watchFileDeleted: '➖ File deleted: {0}',
  watchError: '❌ Watch error: {0}',
  
  // SVG Optimization
  optimizeStart: '🚀 Starting SVG optimization...',
  optimizeComplete: '✅ Optimization complete: {0} → {1}',
  optimizeError: '❌ Optimization error ({0}): {1}',
  optimizeResult: '🎉 Optimized {0} files',
  optimizeOutput: '📁 Optimized SVG output directory: {0}',
  optimizeSkipped: '⏭️ Skipped: {0} (already exists, use --force to overwrite)',
  
  // Config Management
  configSaved: '✅ Configuration saved: {0}',
  configLoaded: 'Configuration loaded from: {0}',
  configLoadError: '❌ Failed to load configuration: {0}',
  configSaveError: '❌ Failed to save configuration: {0}',
  configReset: '✅ Configuration reset to defaults',
  configCurrent: '📋 Current configuration:',
  configSourceDirDisplay: 'Source directory: {0}',
  configOptimizedDirDisplay: 'Optimized directory: {0}',
  configAutoOptimizeDisplay: 'Auto-optimize: {0}',
  configWatchDelayDisplay: 'Watch delay: {0}ms',
  configModulesDisplay: '📂 Modules:',
  configModuleStatus: '{0} {1} → {2}',
  configModuleEnabled: '✅ Enabled',
  configModuleDisabled: '❌ Disabled'
};

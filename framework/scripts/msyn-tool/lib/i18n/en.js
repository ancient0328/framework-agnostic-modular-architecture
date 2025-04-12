/**
 * English language messages for msyn
 */
module.exports = {
  // Common
  welcome: 'msyn - Multi-Framework Asset Synchronization Tool',
  exitCtrlC: 'Press Ctrl+C to exit',
  
  // Config Wizard
  configWelcome: '📝 Welcome to msyn configuration wizard',
  configSourceDir: 'Specify the source directory for assets:',
  configAutoOptimize: 'Automatically optimize SVG files?',
  configWatchMode: 'Enable watch mode for automatic synchronization?',
  configWatchDelay: 'Specify the watch delay time (ms):',
  configWatchDelayInvalid: 'Please enter a positive number',
  configExistingTargets: 'Existing framework targets:',
  configKeepTargets: 'Keep existing targets?',
  configFrameworkSelect: 'Select a framework:',
  configFrameworkCategory: 'Select framework category:',
  configFrameworkOther: 'Other (custom input)',
  configFrameworkName: 'Enter custom framework name:',
  configFrameworkNameInvalid: 'Framework name cannot be empty',
  configTargetDir: 'Enter target directory:',
  configTargetDirInvalid: 'Target directory cannot be empty',
  configFormats: 'Enter supported image formats (comma separated):',
  configFormatsInvalid: 'Please enter at least one format',
  configFormatsSelect: 'Select supported image formats:',
  configFormatsRequired: 'Please select at least one format',
  formatSvgRequiresLibrary: 'SVG (.svg) - Requires additional library for {0}',
  configAddMore: 'Add another framework target?',
  configComplete: '✅ Configuration completed!',
  configStartCommand: 'You can start asset synchronization with:',
  configWatchCommand: 'Or run in watch mode:',
  configOldFormat: '⚠️ Old configuration format detected, converting to new format...',
  configConverted: '✅ Configuration converted to new format',
  
  // Asset Directories
  assetDirsAutoSync: '📂 Asset Directories Setup',
  assetDirsExplanation: 'The following asset directories will be automatically synchronized:',
  assetDirConfigured: '✅ Configured {0} directory: {1}',
  assetCustomAdd: 'Would you like to add a custom asset directory?',
  assetCustomName: 'Enter custom asset folder name:',
  assetCustomNameInvalid: 'Asset folder name cannot be empty',
  assetDirsDisplay: 'Asset Directories:',
  assetSourceDir: 'Source Directory',
  assetOptimizedDir: 'Optimized Directory',
  assetType: 'Asset Type',
  
  // Framework Categories
  frameworkCategoryWeb: 'Web Framework',
  frameworkCategoryMobile: 'Mobile Framework',
  frameworkCategoryNative: 'Native Framework',
  frameworkCategoryOther: 'Other (Custom Input)',
  
  // Framework Detection
  frameworkDetected: '{0} detected at {1}. Use this path?',
  frameworkNotDetected: '{0} not detected. Create {1}?',
  frameworkManualPath: 'Enter path for this framework:',
  targetConfigured: '✅ Set {0} asset type directory to {1} at {2}',
  
  // Directory Operations
  dirCreated: '📁 Created directory: {0}',
  dirCreateError: '❌ Failed to create directory: {0}',
  
  // Language
  languageSelect: 'Select language:',
  languageChanged: '✅ Language changed to {0}',
  languageInvalid: '❌ Invalid language: {0}',
  languageValidValues: 'Valid values: ja, en',
  
  // Sync
  syncStart: '🔄 Starting asset synchronization...',
  syncNoOptimize: ' (SVG optimization disabled)',
  syncNoTargets: '⚠️ No targets to synchronize',
  syncComplete: '🎉 Asset synchronization completed!',
  syncTargetStart: '📂 Starting synchronization for framework \'{0}\'...',
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
  configOptimizeDisplay: 'Auto-optimize: {0}',
  configWatchDisplay: 'Watch mode: {0}',
  configWatchDelayDisplay: 'Watch delay: {0}ms',
  configTargetsDisplay: '📂 Framework targets:',
  configFormatsDisplay: 'Formats',
  configNoTargets: 'No targets configured',
  
  // Common words
  enabled: 'Enabled',
  disabled: 'Disabled'
};

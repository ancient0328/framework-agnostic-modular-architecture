/**
 * msyn - Module Synchronization Tool
 * 
 * A comprehensive asset management and synchronization tool
 * for Containerized Modular Monolith architecture.
 */

const configManager = require('./config-manager');
const syncAssets = require('./sync-assets');
const optimizeSvg = require('./optimize-svg');

// Export main functionality
module.exports = {
  /**
   * Initialize configuration
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} - Configuration object
   */
  initConfig: configManager.initConfig,
  
  /**
   * Get current configuration
   * @returns {Object} - Current configuration
   */
  getConfig: configManager.getConfig,
  
  /**
   * Synchronize assets
   * @param {Object} options - Sync options
   * @returns {Promise<Array>} - List of synchronized files
   */
  syncAssets: syncAssets.sync,
  
  /**
   * Watch for changes and sync automatically
   * @param {Object} options - Watch options
   * @returns {Object} - Watcher instance
   */
  watchAssets: syncAssets.watch,
  
  /**
   * Optimize SVG files
   * @param {Object} options - Optimization options
   * @returns {Promise<Array>} - List of optimized files
   */
  optimizeSvg: optimizeSvg.optimize
};

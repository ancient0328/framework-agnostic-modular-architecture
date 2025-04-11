/**
 * SVG optimization module for msyn
 * 
 * Features:
 * - SVG optimization for React Native compatibility
 * - Batch processing of SVG files
 * - Removal of Inkscape-specific namespaces and unnecessary attributes
 */

const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const chalk = require('chalk');
const { t } = require('./i18n');
const { configManager } = require('./config-manager');

/**
 * Optimize a single SVG file
 * @param {string} svgPath - Path to the SVG file
 * @param {string} outputPath - Path to the output SVG file
 * @param {Object} options - Optimization options
 * @returns {Promise<boolean>} - Success status
 */
async function optimizeSvg(svgPath, outputPath, options = {}) {
  try {
    const svgString = fs.readFileSync(svgPath, 'utf8');
    
    const result = optimize(svgString, {
      plugins: [
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'cleanupAttrs',
        'removeUselessDefs',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'cleanupEnableBackground',
        'removeHiddenElems',
        'removeEmptyText',
        'convertShapeToPath',
        'convertEllipseToCircle',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        'convertPathData',
        'convertTransform',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'mergePaths',
        'removeUnusedNS',
        'sortDefsChildren',
        'removeTitle',
        'removeDesc'
      ]
    });
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, result.data);
    
    if (options.verbose) {
      console.log(chalk.green(t('optimizeComplete', path.basename(svgPath), path.basename(outputPath))));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red(t('optimizeError', path.basename(svgPath), error.message)));
    return false;
  }
}

/**
 * Optimize all SVG files in a directory
 * @param {Object} options - Optimization options
 * @returns {Promise<Array>} - List of optimized files
 */
async function optimizeAllSvg(options = {}) {
  const config = configManager.loadConfig();
  
  // Source and target directories
  const sourceDir = path.resolve(process.cwd(), config.sourceDir);
  const targetDir = path.resolve(process.cwd(), config.optimizedDir);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  console.log(chalk.blue(t('optimizeStart')));
  
  // Get SVG files recursively
  const svgFiles = getAllSvgFiles(sourceDir);
  
  if (svgFiles.length === 0) {
    console.log(chalk.yellow('No SVG files found'));
    return [];
  }
  
  console.log(`Found ${svgFiles.length} SVG files to process...`);
  
  // Optimize each SVG file
  const optimizedFiles = [];
  for (const svgFile of svgFiles) {
    const relativePath = path.relative(sourceDir, svgFile);
    const optimizedPath = path.join(targetDir, relativePath);
    
    // Skip if file exists and force option is not set
    if (fs.existsSync(optimizedPath) && !options.force) {
      if (options.verbose) {
        console.log(chalk.yellow(t('optimizeSkipped', relativePath)));
      }
      continue;
    }
    
    // Optimize SVG
    const success = await optimizeSvg(svgFile, optimizedPath, options);
    if (success) {
      optimizedFiles.push(relativePath);
    }
  }
  
  console.log(chalk.green(t('optimizeResult', optimizedFiles.length)));
  console.log(t('optimizeOutput', targetDir));
  
  return optimizedFiles;
}

/**
 * Get all SVG files in a directory recursively
 * @param {string} dir - Directory to search
 * @param {Array} results - Accumulated results
 * @returns {Array} - List of SVG files
 */
function getAllSvgFiles(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllSvgFiles(filePath, results);
    } else if (file.toLowerCase().endsWith('.svg')) {
      results.push(filePath);
    }
  }
  
  return results;
}

module.exports = {
  optimizeSvg,
  optimizeAllSvg
};

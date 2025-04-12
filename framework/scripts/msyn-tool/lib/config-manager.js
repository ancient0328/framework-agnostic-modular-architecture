/**
 * Configuration management module for msyn
 * 
 * Features:
 * - Interactive configuration wizard
 * - Loading and saving configuration
 * - Configuration validation
 * - Framework detection
 * - Asset directory management
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const glob = require('glob');
const { t, setLanguage } = require('./i18n');

// Configuration file path
const CONFIG_FILE = path.join(process.cwd(), '.msyn.json');

// Default configuration
const DEFAULT_CONFIG = {
  version: '1.1.0',
  language: 'en', // Default language is English
  assets: {
    images: {
      source: 'assets/images/',
      optimized: 'assets/images/.optimized/'
    },
    icons: {
      source: 'assets/icons/',
      optimized: 'assets/icons/.optimized/'
    },
    fonts: {
      source: 'assets/fonts/',
      optimized: null
    }
  },
  targets: [
    {
      destination: 'public/images',
      framework: 'nextjs',
      type: 'web',
      formats: ['webp', 'jpg', 'png', 'svg'],
      assetType: 'images'
    }
  ],
  watch: true,
  optimize: true
};

// Framework categories and options
const FRAMEWORK_CATEGORIES = {
  web: {
    name: 'Web Framework',
    frameworks: [
      { name: 'Next.js', value: 'nextjs' },
      { name: 'React', value: 'react' },
      { name: 'Remix', value: 'remix' },
      { name: 'Vue', value: 'vue' },
      { name: 'Nuxt.js', value: 'nuxtjs' },
      { name: 'Angular', value: 'angular' },
      { name: 'Svelte', value: 'svelte' },
      { name: 'SvelteKit', value: 'sveltekit' },
      { name: 'SolidJS', value: 'solid' },
      { name: 'Astro', value: 'astro' }
    ]
  },
  mobile: {
    name: 'Mobile Framework',
    frameworks: [
      { name: 'React Native', value: 'reactnative' },
      { name: 'Expo', value: 'expo' },
      { name: 'Flutter', value: 'flutter' },
      { name: 'Ionic', value: 'ionic' },
      { name: 'Capacitor', value: 'capacitor' }
    ]
  },
  native: {
    name: 'Native Framework',
    frameworks: [
      { name: 'Swift (iOS)', value: 'swift' },
      { name: 'Kotlin (Android)', value: 'kotlin' },
      { name: 'Xamarin', value: 'xamarin' }
    ]
  }
};

// Framework detection patterns
const FRAMEWORK_DETECTION_PATTERNS = {
  nextjs: {
    files: ['next.config.js', 'package.json'],
    dependencies: ['next']
  },
  react: {
    files: ['package.json'],
    dependencies: ['react', 'react-dom']
  },
  remix: {
    files: ['remix.config.js', 'package.json'],
    dependencies: ['@remix-run/react']
  },
  vue: {
    files: ['vue.config.js', 'package.json'],
    dependencies: ['vue']
  },
  nuxtjs: {
    files: ['nuxt.config.js', 'package.json'],
    dependencies: ['nuxt']
  },
  angular: {
    files: ['angular.json', 'package.json'],
    dependencies: ['@angular/core']
  },
  svelte: {
    files: ['svelte.config.js', 'package.json'],
    dependencies: ['svelte']
  },
  sveltekit: {
    files: ['svelte.config.js', 'package.json'],
    dependencies: ['@sveltejs/kit']
  },
  solid: {
    files: ['package.json'],
    dependencies: ['solid-js']
  },
  astro: {
    files: ['astro.config.mjs', 'package.json'],
    dependencies: ['astro']
  },
  reactnative: {
    files: ['metro.config.js', 'package.json'],
    dependencies: ['react-native']
  },
  expo: {
    files: ['app.json', 'package.json'],
    dependencies: ['expo']
  },
  flutter: {
    files: ['pubspec.yaml']
  },
  ionic: {
    files: ['ionic.config.json', 'package.json'],
    dependencies: ['@ionic/react', '@ionic/angular']
  },
  capacitor: {
    files: ['capacitor.config.json', 'package.json'],
    dependencies: ['@capacitor/core']
  },
  swift: {
    files: ['*.xcodeproj', '*.swift']
  },
  kotlin: {
    files: ['build.gradle', '*.kt']
  },
  xamarin: {
    files: ['*.csproj', '*.sln']
  }
};

// Default asset paths by framework
const DEFAULT_ASSET_PATHS = {
  nextjs: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  react: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  remix: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  vue: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  nuxtjs: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  angular: {
    images: 'src/assets/images',
    icons: 'src/assets/icons',
    fonts: 'src/assets/fonts'
  },
  svelte: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  sveltekit: {
    images: 'static/images',
    icons: 'static/icons',
    fonts: 'static/fonts'
  },
  solid: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  astro: {
    images: 'public/images',
    icons: 'public/icons',
    fonts: 'public/fonts'
  },
  reactnative: {
    images: 'src/assets/images',
    icons: 'src/assets/icons',
    fonts: 'src/assets/fonts'
  },
  expo: {
    images: 'assets/images',
    icons: 'assets/icons',
    fonts: 'assets/fonts'
  },
  flutter: {
    images: 'assets/images',
    icons: 'assets/icons',
    fonts: 'assets/fonts'
  },
  ionic: {
    images: 'src/assets/images',
    icons: 'src/assets/icons',
    fonts: 'src/assets/fonts'
  },
  capacitor: {
    images: 'src/assets/images',
    icons: 'src/assets/icons',
    fonts: 'src/assets/fonts'
  },
  swift: {
    images: 'Resources/Images',
    icons: 'Resources/Icons',
    fonts: 'Resources/Fonts'
  },
  kotlin: {
    images: 'res/drawable',
    icons: 'res/drawable',
    fonts: 'res/font'
  },
  xamarin: {
    images: 'Resources/drawable',
    icons: 'Resources/drawable',
    fonts: 'Resources/font'
  }
};

/**
 * Load configuration from file
 * @returns {Object} Configuration object
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      const config = JSON.parse(configData);
      
      // Set language from config
      if (config.language) {
        setLanguage(config.language);
      }
      
      // Convert old format to new format if needed
      if (!config.assets && config.source) {
        console.log(chalk.yellow(t('configOldFormat')));
        
        // Convert to new asset structure
        config.assets = {
          images: {
            source: config.source,
            optimized: config.source.replace(/\/$/, '') + '/.optimized/'
          }
        };
        
        // Update targets to include assetType
        if (config.targets) {
          config.targets = config.targets.map(target => ({
            ...target,
            assetType: 'images'
          }));
        }
        
        // Set version
        config.version = '1.1.0';
        
        console.log(chalk.green(t('configConverted')));
      }
      
      return config;
    }
  } catch (error) {
    console.error(chalk.red(t('configLoadError', error.message)));
  }
  
  return DEFAULT_CONFIG;
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 */
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log(chalk.green(t('configSaved', CONFIG_FILE)));
  } catch (error) {
    console.error(chalk.red(t('configSaveError', error.message)));
  }
}

/**
 * Ensure directory exists, create if not
 * @param {string} dir - Directory path
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error(chalk.red(t('dirCreateError', error.message)));
    }
  }
}

/**
 * Detect frameworks in the project
 * @param {string} framework - Framework to detect
 * @returns {Array} - Array of detected framework paths
 */
function detectFramework(framework) {
  const detectedPaths = [];
  const rootDir = process.cwd();
  
  // Check if framework has detection patterns
  if (FRAMEWORK_DETECTION_PATTERNS[framework]) {
    const patterns = FRAMEWORK_DETECTION_PATTERNS[framework];
    
    // Search for framework-specific files
    patterns.files.forEach(filePattern => {
      const foundPaths = glob.sync(`**/${filePattern}`, { 
        cwd: rootDir,
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
      });
      
      foundPaths.forEach(foundPath => {
        // If it's a package.json, check dependencies
        if (filePattern === 'package.json' && patterns.dependencies) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, foundPath), 'utf8'));
            const dependencies = { 
              ...packageJson.dependencies || {}, 
              ...packageJson.devDependencies || {} 
            };
            
            // Check if any of the required dependencies exist
            const hasDependency = patterns.dependencies.some(dep => dependencies[dep]);
            
            if (hasDependency) {
              detectedPaths.push(path.dirname(path.join(rootDir, foundPath)));
            }
          } catch (error) {
            // Skip invalid package.json
          }
        } else {
          detectedPaths.push(path.dirname(path.join(rootDir, foundPath)));
        }
      });
    });
  }
  
  // Remove duplicates and return
  return [...new Set(detectedPaths)];
}

/**
 * Detect SVG support based on framework dependencies
 * @param {string} frameworkPath - Path to the framework
 * @param {string} framework - Framework name
 * @returns {boolean} - Whether SVG is supported
 */
function detectSvgSupport(frameworkPath, framework) {
  // デフォルトではSVGをサポートしないフレームワーク
  if (['reactnative', 'expo', 'flutter'].includes(framework)) {
    try {
      const packageJsonPath = path.join(frameworkPath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = { 
          ...packageJson.dependencies || {}, 
          ...packageJson.devDependencies || {} 
        };
        
        // React Native SVGサポート検出
        if (['reactnative', 'expo'].includes(framework) && dependencies['react-native-svg']) {
          return true;
        }
      }
      
      // Flutterの場合はpubspec.yamlをチェック
      if (framework === 'flutter') {
        const pubspecPath = path.join(frameworkPath, 'pubspec.yaml');
        
        if (fs.existsSync(pubspecPath)) {
          const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
          
          // flutter_svgパッケージの検出
          if (pubspecContent.includes('flutter_svg:')) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
  
  // その他のフレームワークはデフォルトでSVGをサポート
  return true;
}

/**
 * Run the configuration wizard
 */
async function runConfigWizard() {
  const config = loadConfig();
  setLanguage(config.language || 'en');
  
  console.log(chalk.blue(t('configWelcome')));
  console.log('');
  
  // Language setting
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: t('languageSelect'),
      choices: [
        { name: 'English', value: 'en' },
        { name: '日本語', value: 'ja' }
      ],
      default: config.language || 'en'
    }
  ]);
  
  // Apply language change immediately if changed
  if (language !== config.language) {
    setLanguage(language);
  }
  
  // Initialize asset directories
  console.log(chalk.blue(t('assetDirsAutoSync')));
  console.log(t('assetDirsExplanation'));
  
  // Ensure asset directories exist
  const assetTypes = ['images', 'icons', 'fonts'];
  const assets = {};
  
  // 最初にすべてのディレクトリを作成
  assetTypes.forEach(assetType => {
    const sourceDir = `assets/${assetType}/`;
    ensureDirectoryExists(sourceDir);
    
    // 画像とアイコンには最適化ディレクトリを作成
    if (assetType === 'images' || assetType === 'icons') {
      const optimizedDir = `assets/${assetType}/.optimized/`;
      ensureDirectoryExists(optimizedDir);
      
      assets[assetType] = {
        source: sourceDir,
        optimized: optimizedDir
      };
    } else {
      // フォントには最適化ディレクトリは不要
      assets[assetType] = {
        source: sourceDir,
        optimized: null
      };
    }
    
    console.log(chalk.green(t('assetDirConfigured', assetType, sourceDir)));
  });
  
  // Ask for custom asset directory
  const { addCustomAsset } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addCustomAsset',
      message: t('assetCustomAdd'),
      default: false
    }
  ]);
  
  if (addCustomAsset) {
    const { customAssetType } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customAssetType',
        message: t('assetCustomName'),
        validate: value => value.trim() !== '' ? true : t('assetCustomNameInvalid')
      }
    ]);
    
    const sourceDir = `assets/${customAssetType}/`;
    const optimizedDir = `assets/${customAssetType}/.optimized/`;
    
    ensureDirectoryExists(sourceDir);
    ensureDirectoryExists(optimizedDir);
    
    assets[customAssetType] = {
      source: sourceDir,
      optimized: optimizedDir
    };
    
    console.log(chalk.green(t('assetDirConfigured', customAssetType, sourceDir)));
  }
  
  // Framework targets
  const targets = [];
  let addMore = true;
  
  while (addMore) {
    // Framework category selection
    const { category } = await inquirer.prompt([
      {
        type: 'list',
        name: 'category',
        message: t('configFrameworkCategory'),
        choices: [
          { name: t('frameworkCategoryWeb'), value: 'web' },
          { name: t('frameworkCategoryMobile'), value: 'mobile' },
          { name: t('frameworkCategoryNative'), value: 'native' },
          { name: t('frameworkCategoryOther'), value: 'other' }
        ]
      }
    ]);
    
    let framework;
    let frameworkType = category;
    
    if (category === 'other') {
      // Custom framework input
      const { customFramework } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customFramework',
          message: t('configFrameworkName'),
          validate: value => value.trim() !== '' ? true : t('configFrameworkNameInvalid')
        }
      ]);
      
      framework = customFramework;
    } else {
      // Framework selection from category
      const { selectedFramework } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedFramework',
          message: t('configFrameworkSelect'),
          choices: FRAMEWORK_CATEGORIES[category].frameworks
        }
      ]);
      
      framework = selectedFramework;
    }
    
    // Detect framework
    const detectedPaths = detectFramework(framework);
    let frameworkPath;
    
    if (detectedPaths.length > 0) {
      // Framework detected, ask to use detected path
      const { useDetected } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useDetected',
          message: t('frameworkDetected', framework, detectedPaths[0]),
          default: true
        }
      ]);
      
      if (useDetected) {
        frameworkPath = detectedPaths[0];
      } else {
        // Manual path input
        const { manualPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'manualPath',
            message: t('frameworkManualPath'),
            default: detectedPaths[0]
          }
        ]);
        
        frameworkPath = manualPath;
      }
    } else {
      // Framework not detected, suggest default path
      const defaultPath = path.join(process.cwd(), framework);
      
      const { createDirectory } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createDirectory',
          message: t('frameworkNotDetected', framework, defaultPath),
          default: true
        }
      ]);
      
      if (createDirectory) {
        frameworkPath = defaultPath;
        ensureDirectoryExists(frameworkPath);
      } else {
        // Manual path input
        const { manualPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'manualPath',
            message: t('frameworkManualPath')
          }
        ]);
        
        frameworkPath = manualPath;
      }
    }
    
    // Configure targets for each asset type
    for (const [assetType, dirs] of Object.entries(assets)) {
      // Get default path for this framework and asset type
      let defaultPath;
      
      if (DEFAULT_ASSET_PATHS[framework] && DEFAULT_ASSET_PATHS[framework][assetType]) {
        defaultPath = path.join(frameworkPath, DEFAULT_ASSET_PATHS[framework][assetType]);
      } else {
        defaultPath = path.join(frameworkPath, `assets/${assetType}`);
      }
      
      // Create destination directory
      ensureDirectoryExists(defaultPath);
      
      // フォント以外の場合のみ画像形式を選択
      if (assetType !== 'fonts') {
        // SVGサポートの検出
        const hasSvgSupport = detectSvgSupport(frameworkPath, framework);
        
        // 利用可能な全フォーマットのリスト
        const availableFormats = [
          { name: 'PNG (.png)', value: 'png', checked: true },
          { name: 'JPEG (.jpg, .jpeg)', value: 'jpg', checked: true },
          { name: 'WebP (.webp)', value: 'webp', checked: frameworkType !== 'native' }
        ];
        
        // SVGサポートがある場合のみSVGオプションを追加
        if (hasSvgSupport) {
          availableFormats.push({ name: 'SVG (.svg)', value: 'svg', checked: true });
        } else if (['reactnative', 'expo', 'flutter'].includes(framework)) {
          // SVGサポートがないが、追加できる可能性があるフレームワーク
          availableFormats.push({ 
            name: t('formatSvgRequiresLibrary', framework), 
            value: 'svg', 
            checked: false 
          });
        }
        
        // GIFは常にオプションとして提供
        availableFormats.push({ name: 'GIF (.gif)', value: 'gif', checked: false });
        
        // チェックボックスで選択
        const { selectedFormats } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedFormats',
            message: t('configFormatsSelect'),
            choices: availableFormats,
            validate: value => value.length > 0 ? true : t('configFormatsRequired')
          }
        ]);
        
        // Add target
        targets.push({
          framework,
          type: frameworkType,
          destination: defaultPath,
          formats: selectedFormats,
          assetType
        });
      } else {
        // フォントの場合はフレームワークタイプに応じたフォーマット設定
        let fontFormats;
        
        if (frameworkType === 'web') {
          // Webフレームワーク向け
          fontFormats = ['woff2', 'woff', 'ttf', 'otf'];
        } else if (frameworkType === 'mobile') {
          // モバイルフレームワーク向け
          fontFormats = ['ttf', 'otf'];
        } else if (frameworkType === 'native') {
          // ネイティブフレームワーク向け
          if (framework === 'swift') {
            fontFormats = ['ttf', 'otf'];
          } else if (framework === 'kotlin') {
            fontFormats = ['ttf'];
          } else {
            fontFormats = ['ttf', 'otf'];
          }
        } else {
          // その他/カスタム
          fontFormats = ['ttf', 'otf', 'woff', 'woff2'];
        }
        
        targets.push({
          framework,
          type: frameworkType,
          destination: defaultPath,
          formats: fontFormats,
          assetType
        });
      }
      
      console.log(chalk.green(t('targetConfigured', assetType, framework, defaultPath)));
    }
    
    // Ask to add another framework
    const { continueAdding } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: t('configAddMore'),
        default: false
      }
    ]);
    
    addMore = continueAdding;
  }
  
  // Watch mode setting
  const { watch } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'watch',
      message: t('configWatchMode'),
      default: config.watch !== undefined ? config.watch : true
    }
  ]);
  
  // Watch delay setting (only if watch is enabled)
  let watchDelay = 2000;
  if (watch) {
    const { delay } = await inquirer.prompt([
      {
        type: 'input',
        name: 'delay',
        message: t('configWatchDelay'),
        default: config.watchDelay || 2000,
        validate: value => {
          const parsed = parseInt(value, 10);
          return !isNaN(parsed) && parsed > 0 ? true : t('configWatchDelayInvalid');
        },
        filter: value => parseInt(value, 10)
      }
    ]);
    
    watchDelay = delay;
  }
  
  // Create new configuration
  const newConfig = {
    version: '1.1.0',
    language,
    assets,
    targets,
    watch,
    optimize: true, // Always enable optimization
    watchDelay
  };
  
  // Save configuration
  saveConfig(newConfig);
  
  console.log(chalk.green('\n' + t('configComplete')));
  console.log(t('configStartCommand'));
  console.log(chalk.cyan('  msyn sync'));
  console.log(t('configWatchCommand'));
  console.log(chalk.cyan('  msyn watch'));
}

/**
 * Display current configuration
 */
function listConfig() {
  const config = loadConfig();
  
  console.log(chalk.blue(t('configCurrent')));
  
  // Display asset directories
  console.log(chalk.blue('\n' + t('assetDirsDisplay')));
  if (config.assets) {
    Object.entries(config.assets).forEach(([assetType, dirs]) => {
      console.log(chalk.cyan(`${assetType}:`));
      console.log(`  ${t('assetSourceDir')}: ${dirs.source}`);
      console.log(`  ${t('assetOptimizedDir')}: ${dirs.optimized}`);
    });
  } else if (config.source) {
    // Legacy format
    console.log(chalk.cyan(t('configSourceDirDisplay', config.source)));
  }
  
  // Display optimization and watch settings
  console.log(chalk.cyan(t('configOptimizeDisplay', config.optimize ? t('enabled') : t('disabled'))));
  console.log(chalk.cyan(t('configWatchDisplay', config.watch ? t('enabled') : t('disabled'))));
  if (config.watch) {
    console.log(chalk.cyan(t('configWatchDelayDisplay', config.watchDelay || 2000)));
  }
  
  // Display targets
  console.log(chalk.blue('\n' + t('configTargetsDisplay')));
  if (config.targets && config.targets.length > 0) {
    config.targets.forEach((target, index) => {
      console.log(`${index + 1}. ${target.framework} (${target.type || 'unknown'}) → ${target.destination}`);
      console.log(`   ${t('assetType')}: ${target.assetType || 'images'}`);
      console.log(`   ${t('configFormatsDisplay')}: ${target.formats.join(', ')}`);
    });
  } else {
    console.log(t('configNoTargets'));
  }
}

/**
 * Reset configuration to defaults
 */
function resetConfig() {
  saveConfig(DEFAULT_CONFIG);
  console.log(chalk.green(t('configReset')));
}

/**
 * Determine language based on various sources
 * @param {string} cliLang - Language from command line
 * @returns {string} - Determined language code
 */
function determineLanguage(cliLang) {
  // Environment variable
  if (process.env.MSYN_LANG && ['ja', 'en'].includes(process.env.MSYN_LANG)) {
    return process.env.MSYN_LANG;
  }
  
  // Command line argument
  if (cliLang && ['ja', 'en'].includes(cliLang)) {
    return cliLang;
  }
  
  // Configuration file
  const config = loadConfig();
  if (config.language && ['ja', 'en'].includes(config.language)) {
    return config.language;
  }
  
  // Default
  return 'en';
}

module.exports = {
  configManager: {
    loadConfig,
    saveConfig,
    runConfigWizard,
    listConfig,
    resetConfig,
    determineLanguage,
    ensureDirectoryExists,
    detectFramework,
    detectSvgSupport
  }
};

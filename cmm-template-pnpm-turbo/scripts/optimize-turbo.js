#!/usr/bin/env node

/**
 * Turborepo最適化スクリプト
 * プロジェクトの規模や要件に応じてTurborepoの設定を最適化します
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// プロジェクトのルートディレクトリ
const rootDir = path.join(__dirname, '..');

// Turborepo設定ファイル
const turboConfigFile = path.join(rootDir, 'turbo.json');

// プロジェクト設定ファイル
const projectConfigFile = path.join(rootDir, '.project-config.json');

/**
 * 質問を表示して回答を取得する
 * @param {string} question - 質問文
 * @param {string} defaultValue - デフォルト値
 * @returns {Promise<string>} - ユーザーの回答
 */
function askQuestion(question, defaultValue = '') {
  const defaultText = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${defaultText}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

/**
 * はい/いいえの質問
 * @param {string} question - 質問文
 * @param {boolean} defaultValue - デフォルト値
 * @returns {Promise<boolean>} - ユーザーの回答
 */
async function askYesNo(question, defaultValue = true) {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  const answer = await askQuestion(`${question} [${defaultText}]`);
  
  if (!answer) return defaultValue;
  
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * 複数選択肢から選択する
 * @param {string} question - 質問文
 * @param {string[]} choices - 選択肢
 * @param {string[]} defaults - デフォルト選択
 * @returns {Promise<string[]>} - 選択された項目
 */
async function askMultipleChoice(question, choices, defaults = []) {
  console.log(`${question} (カンマ区切りで複数選択可、空白で${defaults.join(', ')})`);
  choices.forEach((choice, index) => {
    const isDefault = defaults.includes(choice);
    console.log(`${index + 1}. ${choice}${isDefault ? ' (デフォルト)' : ''}`);
  });
  
  const answer = await askQuestion('選択してください（番号またはカンマ区切りの名前）');
  
  if (!answer) return defaults;
  
  // 番号で選択された場合
  if (/^[0-9,]+$/.test(answer)) {
    return answer.split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => num > 0 && num <= choices.length)
      .map(num => choices[num - 1]);
  }
  
  // 名前で選択された場合
  return answer.split(',')
    .map(name => name.trim())
    .filter(name => choices.includes(name));
}

/**
 * 現在のTurborepo設定を読み込む
 * @returns {Object} - Turborepo設定
 */
function loadTurboConfig() {
  if (fs.existsSync(turboConfigFile)) {
    try {
      return JSON.parse(fs.readFileSync(turboConfigFile, 'utf8'));
    } catch (error) {
      console.error('⚠️ turbo.jsonの読み込みに失敗しました:', error);
      return getDefaultTurboConfig();
    }
  }
  
  return getDefaultTurboConfig();
}

/**
 * デフォルトのTurborepo設定を取得
 * @returns {Object} - デフォルトのTurborepo設定
 */
function getDefaultTurboConfig() {
  return {
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**", "build/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "start": {
        "dependsOn": ["build"]
      },
      "test": {
        "dependsOn": ["build"],
        "outputs": ["coverage/**"],
        "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
      },
      "lint": {},
      "clean": {
        "cache": false
      }
    }
  };
}

/**
 * プロジェクト設定を読み込む
 * @returns {Object} - プロジェクト設定
 */
function loadProjectConfig() {
  if (fs.existsSync(projectConfigFile)) {
    try {
      return JSON.parse(fs.readFileSync(projectConfigFile, 'utf8'));
    } catch (error) {
      console.error('⚠️ プロジェクト設定の読み込みに失敗しました:', error);
      return {};
    }
  }
  
  return {};
}

/**
 * Turborepo設定を保存する
 * @param {Object} config - Turborepo設定
 */
function saveTurboConfig(config) {
  fs.writeFileSync(turboConfigFile, JSON.stringify(config, null, 2));
  console.log('✅ turbo.jsonを更新しました');
}

/**
 * プロジェクトの規模に基づいてTurborepo設定を最適化
 * @param {string} projectSize - プロジェクトの規模
 * @param {Object} turboConfig - Turborepo設定
 * @returns {Object} - 最適化されたTurborepo設定
 */
function optimizeForProjectSize(projectSize, turboConfig) {
  const config = { ...turboConfig };
  
  switch (projectSize) {
    case 'small':
      // 小規模プロジェクト向け最適化
      config.pipeline.build.outputs = ["dist/**"];
      // キャッシュ設定を簡素化
      delete config.pipeline.test.inputs;
      break;
      
    case 'medium':
      // 中規模プロジェクト向け最適化（デフォルト設定を使用）
      break;
      
    case 'large':
      // 大規模プロジェクト向け最適化
      // より詳細なキャッシュ設定
      config.pipeline.build.inputs = ["src/**", "package.json"];
      config.pipeline.test.inputs = [
        "src/**/*.tsx", 
        "src/**/*.ts", 
        "test/**/*.ts", 
        "test/**/*.tsx",
        "**/*.json"
      ];
      // 追加のタスク
      config.pipeline.typecheck = {
        dependsOn: ["^build"],
        inputs: ["src/**/*.tsx", "src/**/*.ts"]
      };
      break;
  }
  
  return config;
}

/**
 * ビルドパフォーマンスに基づいてTurborepo設定を最適化
 * @param {boolean} optimizeForSpeed - 速度重視の最適化
 * @param {Object} turboConfig - Turborepo設定
 * @returns {Object} - 最適化されたTurborepo設定
 */
function optimizeForPerformance(optimizeForSpeed, turboConfig) {
  const config = { ...turboConfig };
  
  if (optimizeForSpeed) {
    // 速度重視の最適化
    // 並列実行の最大化
    config.pipeline.build.dependsOn = ["^build"];
    // キャッシュの積極的な活用
    if (!config.pipeline.build.inputs) {
      config.pipeline.build.inputs = ["src/**", "package.json"];
    }
  } else {
    // 安定性重視の最適化
    // より保守的な依存関係
    config.pipeline.build.dependsOn = ["^build", "lint"];
    // より厳密なキャッシュ無効化
    config.pipeline.dev.cache = false;
  }
  
  return config;
}

/**
 * モジュール構成に基づいてTurborepo設定を最適化
 * @param {string[]} modules - モジュール一覧
 * @param {Object} turboConfig - Turborepo設定
 * @returns {Object} - 最適化されたTurborepo設定
 */
function optimizeForModules(modules, turboConfig) {
  const config = { ...turboConfig };
  
  // モジュール固有のタスク設定
  if (modules.length > 3) {
    // 多数のモジュールがある場合、より詳細なタスク定義
    config.pipeline = {
      ...config.pipeline,
      // モジュール共通のタスク
      "build": {
        dependsOn: ["^build"],
        outputs: ["dist/**", ".next/**", "build/**"]
      },
      // APIゲートウェイ固有のタスク
      "api-gateway#build": {
        dependsOn: ["^build"],
        outputs: ["dist/**"]
      },
      // フロントエンド固有のタスク
      "frontend#build": {
        dependsOn: ["^build", "sync-assets"],
        outputs: ["dist/**", ".next/**", "build/**"]
      }
    };
  }
  
  return config;
}

/**
 * キャッシュ設定を最適化
 * @param {string} cacheStrategy - キャッシュ戦略
 * @param {Object} turboConfig - Turborepo設定
 * @returns {Object} - 最適化されたTurborepo設定
 */
function optimizeCacheStrategy(cacheStrategy, turboConfig) {
  const config = { ...turboConfig };
  
  switch (cacheStrategy) {
    case 'aggressive':
      // 積極的なキャッシュ戦略
      config.pipeline.build.inputs = ["src/**", "package.json"];
      config.pipeline.test.inputs = ["src/**", "test/**", "package.json"];
      break;
      
    case 'balanced':
      // バランスの取れたキャッシュ戦略（デフォルト）
      break;
      
    case 'conservative':
      // 保守的なキャッシュ戦略
      // キャッシュの利用を最小限に
      config.pipeline.build.cache = false;
      config.pipeline.test.cache = false;
      break;
  }
  
  return config;
}

/**
 * Turborepo設定を最適化する
 */
async function optimizeTurbo() {
  console.log('🔧 Turborepo設定の最適化を開始します');
  
  // 現在の設定を読み込む
  let turboConfig = loadTurboConfig();
  const projectConfig = loadProjectConfig();
  
  // プロジェクトの規模
  const projectSize = await askQuestion(
    'プロジェクトの規模を選択してください',
    'medium',
    ['small', 'medium', 'large']
  );
  
  // パフォーマンス最適化の方針
  const optimizeForSpeed = await askYesNo(
    'ビルド速度を優先しますか？（いいえの場合は安定性優先）',
    true
  );
  
  // キャッシュ戦略
  const cacheStrategy = await askQuestion(
    'キャッシュ戦略を選択してください',
    'balanced',
    ['aggressive', 'balanced', 'conservative']
  );
  
  // モジュール構成
  const modules = projectConfig.modules || 
    await askMultipleChoice(
      'プロジェクトに含まれるモジュールを選択してください',
      ['api-gateway', 'auth', 'module-a', 'module-b', 'module-c'],
      ['api-gateway', 'auth', 'module-a', 'module-b']
    );
  
  // 追加のタスク
  const additionalTasks = await askMultipleChoice(
    '追加のタスクを選択してください',
    ['typecheck', 'format', 'deploy', 'storybook', 'e2e'],
    []
  );
  
  // 設定の最適化
  turboConfig = optimizeForProjectSize(projectSize, turboConfig);
  turboConfig = optimizeForPerformance(optimizeForSpeed, turboConfig);
  turboConfig = optimizeForModules(modules, turboConfig);
  turboConfig = optimizeCacheStrategy(cacheStrategy, turboConfig);
  
  // 追加のタスクを設定
  additionalTasks.forEach(task => {
    switch (task) {
      case 'typecheck':
        turboConfig.pipeline.typecheck = {
          dependsOn: [],
          inputs: ["src/**/*.tsx", "src/**/*.ts", "tsconfig.json"]
        };
        break;
        
      case 'format':
        turboConfig.pipeline.format = {
          outputs: [],
          cache: false
        };
        break;
        
      case 'deploy':
        turboConfig.pipeline.deploy = {
          dependsOn: ["build", "test", "lint"],
          outputs: []
        };
        break;
        
      case 'storybook':
        turboConfig.pipeline.storybook = {
          dependsOn: ["^build"],
          outputs: ["storybook-static/**"]
        };
        break;
        
      case 'e2e':
        turboConfig.pipeline["e2e"] = {
          dependsOn: ["^build"],
          outputs: ["cypress/videos/**", "cypress/screenshots/**"]
        };
        break;
    }
  });
  
  // 設定の確認
  console.log('\n📋 最適化されたTurborepo設定の概要:');
  console.log(`プロジェクト規模: ${projectSize}`);
  console.log(`最適化方針: ${optimizeForSpeed ? '速度優先' : '安定性優先'}`);
  console.log(`キャッシュ戦略: ${cacheStrategy}`);
  console.log(`モジュール: ${modules.join(', ')}`);
  console.log(`追加タスク: ${additionalTasks.length > 0 ? additionalTasks.join(', ') : 'なし'}`);
  
  const confirm = await askYesNo('\nこの設定でturbo.jsonを更新しますか？');
  if (!confirm) {
    console.log('❌ Turborepo設定の最適化をキャンセルしました');
    rl.close();
    return;
  }
  
  // 設定の保存
  saveTurboConfig(turboConfig);
  
  console.log('\n✅ Turborepo設定の最適化が完了しました');
  console.log('\n最適化されたTurborepoを使用するには:');
  console.log('1. pnpm build を実行してビルドパフォーマンスを確認します');
  console.log('2. pnpm turbo run build --dry を実行して依存関係グラフを確認します');
  
  rl.close();
}

// スクリプトが直接実行された場合
if (require.main === module) {
  optimizeTurbo().catch(err => {
    console.error('❌ Turborepo設定の最適化中にエラーが発生しました:', err);
    process.exit(1);
  });
}

module.exports = optimizeTurbo;

#!/usr/bin/env node

/**
 * プロジェクト初期化スクリプト
 * pnpmとTurborepoを使用したコンテナ化モジュラーモノリスプロジェクトを初期化します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// プロジェクトのルートディレクトリ
const rootDir = path.join(__dirname, '..');

// プロジェクト設定を保存するファイル
const projectConfigFile = path.join(rootDir, '.project-config.json');

// デフォルト設定
const defaultConfig = {
  name: 'my-modular-monolith',
  description: 'コンテナ化モジュラーモノリスプロジェクト',
  version: '0.1.0',
  author: '',
  modules: ['module-a', 'module-b'],
  frontends: ['web'],
  database: 'postgres',
  cache: 'redis',
  monitoring: true
};

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
 * package.jsonファイルを更新する
 * @param {Object} config - プロジェクト設定
 */
function updatePackageJson(config) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.name = config.name;
  packageJson.description = config.description;
  packageJson.version = config.version;
  packageJson.author = config.author;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.jsonを更新しました');
}

/**
 * READMEファイルを更新する
 * @param {Object} config - プロジェクト設定
 */
function updateReadme(config) {
  const readmePath = path.join(rootDir, 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // タイトルと説明を更新
  readmeContent = readmeContent.replace(
    /# .*?\n/,
    `# ${config.name}\n`
  );
  
  readmeContent = readmeContent.replace(
    /このリポジトリは.*?です。/,
    `${config.description}`
  );
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ README.mdを更新しました');
}

/**
 * モジュールを追加する
 * @param {string[]} modules - 追加するモジュール名の配列
 */
function setupModules(modules) {
  const templateDir = path.join(rootDir, 'modules', '_template_');
  
  // 既存のモジュールを削除（_template_以外）
  const modulesDir = path.join(rootDir, 'modules');
  fs.readdirSync(modulesDir).forEach(file => {
    const filePath = path.join(modulesDir, file);
    if (file !== '_template_' && fs.statSync(filePath).isDirectory()) {
      try {
        execSync(`rm -rf ${filePath}`);
      } catch (error) {
        console.error(`❌ モジュール ${file} の削除に失敗しました:`, error);
      }
    }
  });
  
  // 新しいモジュールを追加
  modules.forEach(module => {
    const moduleDir = path.join(rootDir, 'modules', module);
    
    try {
      execSync(`cp -r ${templateDir} ${moduleDir}`);
      
      // package.jsonを更新
      const packageJsonPath = path.join(moduleDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        packageJson.name = `@${defaultConfig.name}/${module}`;
        packageJson.description = `${module}モジュール`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
      
      console.log(`✅ モジュール ${module} を作成しました`);
    } catch (error) {
      console.error(`❌ モジュール ${module} の作成に失敗しました:`, error);
    }
  });
}

/**
 * フロントエンドを設定する
 * @param {string[]} frontends - 設定するフロントエンド
 */
function setupFrontends(frontends) {
  const frontendTypes = {
    web: 'Webフロントエンド',
    mobile: 'モバイルフロントエンド'
  };
  
  // 既存のフロントエンドを確認
  const frontendDir = path.join(rootDir, 'frontend');
  Object.keys(frontendTypes).forEach(type => {
    const typeDir = path.join(frontendDir, type);
    const include = frontends.includes(type);
    
    if (include && !fs.existsSync(typeDir)) {
      // ディレクトリが存在しない場合は作成
      fs.mkdirSync(typeDir, { recursive: true });
      
      // package.jsonを作成
      const packageJson = {
        name: `@${defaultConfig.name}/${type}-frontend`,
        version: '0.1.0',
        description: `${frontendTypes[type]}`,
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
          lint: 'eslint . --ext .ts,.tsx',
          format: 'prettier --write "src/**/*.{ts,tsx}"',
          test: 'vitest run',
          clean: 'rimraf dist'
        }
      };
      
      fs.writeFileSync(
        path.join(typeDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      console.log(`✅ ${frontendTypes[type]}を作成しました`);
    } else if (!include && fs.existsSync(typeDir)) {
      // 不要なフロントエンドを削除
      try {
        execSync(`rm -rf ${typeDir}`);
        console.log(`✅ ${frontendTypes[type]}を削除しました`);
      } catch (error) {
        console.error(`❌ ${frontendTypes[type]}の削除に失敗しました:`, error);
      }
    }
  });
}

/**
 * docker-compose.ymlを更新する
 * @param {Object} config - プロジェクト設定
 */
function updateDockerCompose(config) {
  const dockerComposePath = path.join(rootDir, 'docker-compose.yml');
  let dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
  
  // データベース設定
  if (config.database !== 'postgres') {
    // PostgreSQL以外のデータベースを使用する場合の処理
    // 現在はPostgreSQLのみサポート
  }
  
  // キャッシュ設定
  if (config.cache !== 'redis') {
    // Redis以外のキャッシュを使用する場合の処理
    // 現在はRedisのみサポート
  }
  
  // モニタリング設定
  if (!config.monitoring) {
    // モニタリングを無効にする場合
    dockerComposeContent = dockerComposeContent
      .replace(/\s+# Prometheus.*?app-network\n/s, '\n')
      .replace(/\s+# Grafana.*?app-network\n/s, '\n')
      .replace(/\s+prometheus-data:/, '')
      .replace(/\s+grafana-data:/, '');
  }
  
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  console.log('✅ docker-compose.ymlを更新しました');
}

/**
 * プロジェクト設定を保存する
 * @param {Object} config - プロジェクト設定
 */
function saveProjectConfig(config) {
  fs.writeFileSync(projectConfigFile, JSON.stringify(config, null, 2));
  console.log('✅ プロジェクト設定を保存しました');
}

/**
 * プロジェクトを初期化する
 */
async function initProject() {
  console.log('🚀 コンテナ化モジュラーモノリスプロジェクトの初期化を開始します');
  
  // 既存の設定を読み込む
  let config = {};
  if (fs.existsSync(projectConfigFile)) {
    try {
      config = JSON.parse(fs.readFileSync(projectConfigFile, 'utf8'));
      console.log('ℹ️ 既存のプロジェクト設定を読み込みました');
    } catch (error) {
      console.error('⚠️ 既存の設定の読み込みに失敗しました。デフォルト設定を使用します。');
      config = { ...defaultConfig };
    }
  } else {
    config = { ...defaultConfig };
  }
  
  // プロジェクト情報の入力
  config.name = await askQuestion('プロジェクト名', config.name);
  config.description = await askQuestion('プロジェクトの説明', config.description);
  config.version = await askQuestion('バージョン', config.version);
  config.author = await askQuestion('作者', config.author);
  
  // モジュール設定
  const defaultModules = config.modules || defaultConfig.modules;
  config.modules = await askMultipleChoice(
    'プロジェクトに含めるモジュールを選択してください',
    ['module-a', 'module-b', 'module-c', 'module-d'],
    defaultModules
  );
  
  // フロントエンド設定
  const defaultFrontends = config.frontends || defaultConfig.frontends;
  config.frontends = await askMultipleChoice(
    'プロジェクトに含めるフロントエンドを選択してください',
    ['web', 'mobile'],
    defaultFrontends
  );
  
  // データベース設定
  config.database = await askQuestion(
    'データベースを選択してください (postgres)',
    config.database || defaultConfig.database
  );
  
  // キャッシュ設定
  config.cache = await askQuestion(
    'キャッシュを選択してください (redis)',
    config.cache || defaultConfig.cache
  );
  
  // モニタリング設定
  config.monitoring = await askYesNo(
    'モニタリング（Prometheus/Grafana）を有効にしますか？',
    config.monitoring !== undefined ? config.monitoring : defaultConfig.monitoring
  );
  
  // 設定の確認
  console.log('\n📋 プロジェクト設定の概要:');
  console.log(`プロジェクト名: ${config.name}`);
  console.log(`説明: ${config.description}`);
  console.log(`バージョン: ${config.version}`);
  console.log(`作者: ${config.author}`);
  console.log(`モジュール: ${config.modules.join(', ')}`);
  console.log(`フロントエンド: ${config.frontends.join(', ')}`);
  console.log(`データベース: ${config.database}`);
  console.log(`キャッシュ: ${config.cache}`);
  console.log(`モニタリング: ${config.monitoring ? '有効' : '無効'}`);
  
  const confirm = await askYesNo('\nこの設定でプロジェクトを初期化しますか？');
  if (!confirm) {
    console.log('❌ プロジェクトの初期化をキャンセルしました');
    rl.close();
    return;
  }
  
  // プロジェクトの初期化
  try {
    updatePackageJson(config);
    updateReadme(config);
    setupModules(config.modules);
    setupFrontends(config.frontends);
    updateDockerCompose(config);
    saveProjectConfig(config);
    
    console.log('\n✅ プロジェクトの初期化が完了しました');
    console.log('\n次のステップ:');
    console.log('1. pnpm install を実行して依存関係をインストールします');
    console.log('2. pnpm dev を実行して開発サーバーを起動します');
    console.log('3. docker-compose up -d を実行してコンテナを起動します');
  } catch (error) {
    console.error('❌ プロジェクトの初期化中にエラーが発生しました:', error);
  }
  
  rl.close();
}

// スクリプトが直接実行された場合
if (require.main === module) {
  initProject().catch(err => {
    console.error('❌ プロジェクト初期化中にエラーが発生しました:', err);
    process.exit(1);
  });
}

module.exports = initProject;

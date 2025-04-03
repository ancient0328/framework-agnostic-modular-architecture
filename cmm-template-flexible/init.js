#!/usr/bin/env node

/**
 * コンテナ化モジュラーモノリスプロジェクト初期化スクリプト
 * 新しいプロジェクトのセットアップを対話的に行います
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { selectPackageManager, savePackageManagerConfig } = require('./package-manager');
const { selectFrontendFramework, saveFrontendConfig, createFrontendProject } = require('./frontend-config');

// 対話型インターフェース
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// プロジェクト設定
let projectConfig = {
  name: '',
  description: '',
  packageManager: null,
  frontendFramework: null,
  modules: [],
  database: 'postgres',
  useRedis: false,
  useDocker: true
};

/**
 * 対話形式で質問する
 */
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * プロジェクト名を取得
 */
async function getProjectName() {
  const defaultName = path.basename(process.cwd());
  const answer = await question(`プロジェクト名 (デフォルト: ${defaultName}): `);
  return answer || defaultName;
}

/**
 * プロジェクト説明を取得
 */
async function getProjectDescription() {
  return await question('プロジェクトの説明: ');
}

/**
 * データベース選択
 */
async function selectDatabase() {
  console.log('使用するデータベースを選択してください:');
  console.log('1. PostgreSQL (デフォルト)');
  console.log('2. MySQL');
  console.log('3. MongoDB');
  console.log('4. SQLite');
  
  const answer = await question('選択: ');
  
  switch (answer) {
    case '2': return 'mysql';
    case '3': return 'mongodb';
    case '4': return 'sqlite';
    default: return 'postgres';
  }
}

/**
 * Redisの使用有無
 */
async function askUseRedis() {
  const answer = await question('Redisを使用しますか？ (y/N): ');
  return answer.toLowerCase() === 'y';
}

/**
 * Dockerの使用有無
 */
async function askUseDocker() {
  const answer = await question('Dockerを使用しますか？ (Y/n): ');
  return answer.toLowerCase() !== 'n';
}

/**
 * 初期モジュールの選択
 */
async function selectInitialModules() {
  console.log('初期モジュールを選択してください (カンマ区切りで複数選択可):');
  console.log('1. auth - 認証・認可モジュール');
  console.log('2. user - ユーザー管理モジュール');
  console.log('3. notification - 通知モジュール');
  console.log('4. payment - 決済モジュール');
  console.log('5. admin - 管理画面モジュール');
  
  const answer = await question('選択 (デフォルト: 1,2): ');
  
  if (!answer) {
    return ['auth', 'user'];
  }
  
  const moduleMap = {
    '1': 'auth',
    '2': 'user',
    '3': 'notification',
    '4': 'payment',
    '5': 'admin'
  };
  
  return answer.split(',')
    .map(num => num.trim())
    .filter(num => moduleMap[num])
    .map(num => moduleMap[num]);
}

/**
 * プロジェクト設定を保存
 */
function saveProjectConfig() {
  fs.writeFileSync(
    path.join(process.cwd(), '.project-config.json'),
    JSON.stringify(projectConfig, null, 2)
  );
}

/**
 * プロジェクト構造を作成
 */
function createProjectStructure() {
  const directories = [
    'docs',
    'frontend',
    'frontend/web',
    'frontend/mobile',
    'modules',
    'api-gateway',
    'auth',
    'scripts',
    'assets'
  ];
  
  // 選択したモジュールのディレクトリを作成
  projectConfig.modules.forEach(module => {
    directories.push(`modules/${module}`);
    directories.push(`modules/${module}/backend`);
    directories.push(`modules/${module}/frontend`);
  });
  
  // ディレクトリ作成
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`ディレクトリを作成しました: ${dir}`);
    }
  });
}

/**
 * ルートpackage.jsonを作成
 */
function createRootPackageJson() {
  const packageJson = {
    name: projectConfig.name,
    version: '0.1.0',
    description: projectConfig.description,
    private: true,
    workspaces: [
      'api-gateway',
      'auth',
      'frontend/*',
      'modules/**/backend',
      'modules/**/frontend'
    ],
    scripts: {
      dev: 'node scripts/dev.js',
      build: 'node scripts/build.js',
      'sync-assets': 'node scripts/sync-assets.js'
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('package.jsonを作成しました');
}

/**
 * Docker Composeファイルを作成
 */
function createDockerComposeFile() {
  if (!projectConfig.useDocker) {
    return;
  }
  
  let dbService = '';
  
  // データベースサービスの設定
  switch (projectConfig.database) {
    case 'postgres':
      dbService = `
  database:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${projectConfig.name}
    volumes:
      - postgres_data:/var/lib/postgresql/data`;
      break;
    case 'mysql':
      dbService = `
  database:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ${projectConfig.name}
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql`;
      break;
    case 'mongodb':
      dbService = `
  database:
    image: mongo:5
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
      MONGO_INITDB_DATABASE: ${projectConfig.name}
    volumes:
      - mongo_data:/data/db`;
      break;
  }
  
  // Redisサービスの設定
  const redisService = projectConfig.useRedis ? `
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data` : '';
  
  // モジュールサービスの設定
  const moduleServices = projectConfig.modules.map(module => `
  ${module}:
    build:
      context: ./modules/${module}
    ports:
      - "${getModulePort(module)}:${getModulePort(module)}"
    environment:
      - NODE_ENV=development
    depends_on:
      - database${projectConfig.useRedis ? '\n      - redis' : ''}`).join('');
  
  // Docker Composeファイルの内容
  const dockerCompose = `version: '3.8'

services:
  api-gateway:
    build:
      context: ./api-gateway
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
    depends_on:
      - auth${projectConfig.modules.map(m => `\n      - ${m}`).join('')}

  auth:
    build:
      context: ./auth
    ports:
      - "4050:4050"
    environment:
      - NODE_ENV=development
    depends_on:
      - database${projectConfig.useRedis ? '\n      - redis' : ''}

  frontend:
    build:
      context: ./frontend/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - api-gateway${moduleServices}${dbService}${redisService}

volumes:${projectConfig.database === 'postgres' ? '\n  postgres_data:' : ''}${projectConfig.database === 'mysql' ? '\n  mysql_data:' : ''}${projectConfig.database === 'mongodb' ? '\n  mongo_data:' : ''}${projectConfig.useRedis ? '\n  redis_data:' : ''}
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'docker-compose.yml'),
    dockerCompose
  );
  
  console.log('docker-compose.ymlを作成しました');
}

/**
 * モジュールのポート番号を取得
 */
function getModulePort(moduleName) {
  const basePorts = {
    auth: 4050,
    user: 4100,
    notification: 4110,
    payment: 4120,
    admin: 4130
  };
  
  return basePorts[moduleName] || 4100;
}

/**
 * アセット同期スクリプトを作成
 */
function createAssetSyncScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * アセット同期スクリプト
 * 共有アセットを各モジュールに同期します
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 共有アセットディレクトリ
const sharedAssetsDir = path.join(__dirname, '../assets');

// ターゲットディレクトリ
const targetDirs = [
  'frontend/web/src/assets',
  'frontend/mobile/src/assets',
  ...glob.sync('modules/*/frontend/src/assets', { cwd: path.join(__dirname, '..') })
];

// アセット同期関数
async function syncAssets() {
  // 共有アセットディレクトリが存在するか確認
  if (!fs.existsSync(sharedAssetsDir)) {
    console.error(\`❌ エラー: 共有アセットディレクトリが見つかりません: \${sharedAssetsDir}\`);
    return;
  }

  console.log('🔄 アセット同期を開始します...');

  // 各ターゲットディレクトリに対して処理
  for (const relativeDir of targetDirs) {
    const targetDir = path.join(__dirname, '..', relativeDir);
    
    // ターゲットディレクトリが存在しない場合は作成
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(\`📁 ディレクトリを作成しました: \${relativeDir}\`);
    }
    
    // アセットファイルをコピー
    const assetFiles = glob.sync('**/*', { 
      cwd: sharedAssetsDir, 
      nodir: true 
    });
    
    for (const file of assetFiles) {
      const sourcePath = path.join(sharedAssetsDir, file);
      const targetPath = path.join(targetDir, file);
      
      // ターゲットディレクトリが存在しない場合は作成
      const targetDirPath = path.dirname(targetPath);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      
      // ファイルをコピー
      fs.copyFileSync(sourcePath, targetPath);
      console.log(\`📄 コピー: \${file} -> \${relativeDir}\`);
    }
  }

  console.log('✅ アセット同期が完了しました');
}

// スクリプトが直接実行された場合
if (require.main === module) {
  syncAssets().catch(err => {
    console.error('❌ アセット同期中にエラーが発生しました:', err);
    process.exit(1);
  });
}

module.exports = syncAssets;
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/sync-assets.js'),
    scriptContent
  );
  
  console.log('アセット同期スクリプトを作成しました');
}

/**
 * 開発スクリプトを作成
 */
function createDevScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * 開発サーバー起動スクリプト
 * 各モジュールの開発サーバーを並行して起動します
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const syncAssets = require('./sync-assets');
const { getPackageManagerConfig } = require('../package-manager');

// パッケージマネージャー設定を取得
const packageManager = getPackageManagerConfig();

// プロジェクト設定を取得
const projectConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../.project-config.json'), 'utf8')
);

// 開発サーバーを起動する関数
async function startDevServers() {
  // まずアセットを同期
  await syncAssets();
  
  console.log('🚀 開発サーバーを起動します...');
  
  // フロントエンドサーバー
  const frontendProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../frontend/web'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // APIゲートウェイ
  const apiGatewayProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../api-gateway'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // 認証サーバー
  const authProcess = spawn(
    packageManager.name,
    [packageManager.runCmd, 'dev'],
    {
      cwd: path.join(__dirname, '../auth'),
      stdio: 'inherit',
      shell: true
    }
  );
  
  // 各モジュールのサーバー
  const moduleProcesses = projectConfig.modules.map(module => {
    return spawn(
      packageManager.name,
      [packageManager.runCmd, 'dev'],
      {
        cwd: path.join(__dirname, \`../modules/\${module}/backend\`),
        stdio: 'inherit',
        shell: true
      }
    );
  });
  
  // プロセス終了時の処理
  const cleanup = () => {
    console.log('\\n🛑 開発サーバーを停止します...');
    frontendProcess.kill();
    apiGatewayProcess.kill();
    authProcess.kill();
    moduleProcesses.forEach(p => p.kill());
    process.exit(0);
  };
  
  // シグナルハンドリング
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// スクリプトが直接実行された場合
if (require.main === module) {
  startDevServers().catch(err => {
    console.error('❌ 開発サーバー起動中にエラーが発生しました:', err);
    process.exit(1);
  });
}
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/dev.js'),
    scriptContent
  );
  
  console.log('開発スクリプトを作成しました');
}

/**
 * READMEファイルを作成
 */
function createReadme() {
  const readmeContent = `# ${projectConfig.name}

${projectConfig.description}

## プロジェクト構造

\`\`\`
${projectConfig.name}/
├── api-gateway/        # APIゲートウェイ
├── auth/               # 認証・認可サービス
├── docs/               # ドキュメント
├── frontend/           # フロントエンド
│   ├── web/            # Webアプリケーション
│   └── mobile/         # モバイルアプリケーション
├── modules/            # 機能モジュール
${projectConfig.modules.map(m => `│   └── ${m}/            # ${getModuleDescription(m)}`).join('\n')}
├── assets/             # 共有アセット
├── scripts/            # ユーティリティスクリプト
├── docker-compose.yml  # Docker構成
└── package.json        # プロジェクト設定
\`\`\`

## 開発環境のセットアップ

### 前提条件

- Node.js ${getNodeVersion()}以上
- ${projectConfig.packageManager.name}
- ${projectConfig.useDocker ? 'Docker' : ''}

### インストール

\`\`\`bash
# 依存関係のインストール
${projectConfig.packageManager.installCmd}

# 開発サーバーの起動
${projectConfig.packageManager.runCmd} dev
\`\`\`

${projectConfig.useDocker ? `
### Dockerでの実行

\`\`\`bash
# コンテナのビルドと起動
docker-compose up --build
\`\`\`
` : ''}

## 機能モジュール

このプロジェクトは以下のモジュールで構成されています：

${projectConfig.modules.map(m => `- **${m}**: ${getModuleDescription(m)}`).join('\n')}

## アセット管理

共有アセットは \`assets/\` ディレクトリに配置され、各モジュールに自動的に同期されます。

\`\`\`bash
# アセットの同期
${projectConfig.packageManager.runCmd} sync-assets
\`\`\`

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'README.md'),
    readmeContent
  );
  
  console.log('READMEを作成しました');
}

/**
 * モジュールの説明を取得
 */
function getModuleDescription(moduleName) {
  const descriptions = {
    auth: '認証・認可モジュール',
    user: 'ユーザー管理モジュール',
    notification: '通知モジュール',
    payment: '決済モジュール',
    admin: '管理画面モジュール'
  };
  
  return descriptions[moduleName] || `${moduleName}モジュール`;
}

/**
 * Node.jsのバージョンを取得
 */
function getNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    return version.replace('v', '');
  } catch (error) {
    return '14.0.0';
  }
}

/**
 * フロントエンドプロジェクトを初期化
 */
async function initializeFrontend() {
  const webDir = path.join(process.cwd(), 'frontend/web');
  
  if (!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, { recursive: true });
  }
  
  console.log(`フロントエンドプロジェクトを初期化します (${projectConfig.frontendFramework.name})...`);
  
  try {
    createFrontendProject(
      projectConfig.frontendFramework,
      webDir,
      { args: '--template typescript' }
    );
  } catch (error) {
    console.error(`フロントエンド初期化中にエラーが発生しました: ${error.message}`);
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 コンテナ化モジュラーモノリスプロジェクトの初期化を開始します');
  
  try {
    // プロジェクト情報の収集
    projectConfig.name = await getProjectName();
    projectConfig.description = await getProjectDescription();
    
    // パッケージマネージャーの選択
    projectConfig.packageManager = await selectPackageManager();
    savePackageManagerConfig(projectConfig.packageManager);
    
    // フロントエンドフレームワークの選択
    const frontendKey = await selectFrontendFramework();
    projectConfig.frontendFramework = saveFrontendConfig(frontendKey);
    
    // データベースの選択
    projectConfig.database = await selectDatabase();
    
    // Redisの使用有無
    projectConfig.useRedis = await askUseRedis();
    
    // Dockerの使用有無
    projectConfig.useDocker = await askUseDocker();
    
    // 初期モジュールの選択
    projectConfig.modules = await selectInitialModules();
    
    // 設定の保存
    saveProjectConfig();
    
    // プロジェクト構造の作成
    createProjectStructure();
    
    // 各種ファイルの作成
    createRootPackageJson();
    if (projectConfig.useDocker) {
      createDockerComposeFile();
    }
    createAssetSyncScript();
    createDevScript();
    createReadme();
    
    // フロントエンドプロジェクトの初期化
    await initializeFrontend();
    
    console.log(`
✅ プロジェクト初期化が完了しました！

次のステップ:
1. 依存関係をインストール: ${projectConfig.packageManager.installCmd}
2. 開発サーバーを起動: ${projectConfig.packageManager.runCmd} dev
${projectConfig.useDocker ? `3. Dockerで実行: docker-compose up --build` : ''}

詳細はREADME.mdを参照してください。
`);
  } catch (error) {
    console.error('❌ 初期化中にエラーが発生しました:', error);
  } finally {
    rl.close();
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  main();
}

module.exports = {
  initializeProject: main
};

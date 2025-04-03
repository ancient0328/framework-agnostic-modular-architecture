#!/usr/bin/env node

/**
 * パッケージマネージャー検出・選択スクリプト
 * プロジェクト内で一貫したパッケージマネージャーの使用を支援します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 検出可能なパッケージマネージャー
const PACKAGE_MANAGERS = {
  npm: {
    lockfile: 'package-lock.json',
    installCmd: 'npm install',
    addCmd: 'npm install',
    addDevCmd: 'npm install --save-dev',
    runCmd: 'npm run',
    workspaceFlag: '--workspace',
    workspaceRoot: '-w'
  },
  yarn: {
    lockfile: 'yarn.lock',
    installCmd: 'yarn',
    addCmd: 'yarn add',
    addDevCmd: 'yarn add --dev',
    runCmd: 'yarn',
    workspaceFlag: 'workspace',
    workspaceRoot: '-W'
  },
  pnpm: {
    lockfile: 'pnpm-lock.yaml',
    installCmd: 'pnpm install',
    addCmd: 'pnpm add',
    addDevCmd: 'pnpm add -D',
    runCmd: 'pnpm',
    workspaceFlag: '--filter',
    workspaceRoot: '-w'
  }
};

/**
 * 使用中のパッケージマネージャーを検出
 */
function detectPackageManager() {
  // ロックファイルの存在確認
  for (const [name, config] of Object.entries(PACKAGE_MANAGERS)) {
    if (fs.existsSync(path.join(process.cwd(), config.lockfile))) {
      return name;
    }
  }

  // グローバルにインストールされているパッケージマネージャーを確認
  for (const name of Object.keys(PACKAGE_MANAGERS)) {
    try {
      execSync(`${name} --version`, { stdio: 'ignore' });
      return name;
    } catch (e) {
      // コマンドが見つからない場合は次へ
    }
  }

  // デフォルトはnpm
  return 'npm';
}

/**
 * パッケージマネージャーを対話的に選択
 */
async function selectPackageManager() {
  const detected = detectPackageManager();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(
      `パッケージマネージャーを選択してください (検出: ${detected}):\n` +
      `1. npm\n` +
      `2. yarn\n` +
      `3. pnpm\n` +
      `選択 (デフォルト: ${detected}): `,
      (answer) => {
        rl.close();
        
        const selection = answer.trim();
        if (!selection) {
          return resolve(detected);
        }
        
        switch (selection) {
          case '1': return resolve('npm');
          case '2': return resolve('yarn');
          case '3': return resolve('pnpm');
          default: return resolve(detected);
        }
      }
    );
  });
}

/**
 * 選択されたパッケージマネージャーの設定を保存
 */
function savePackageManagerConfig(name) {
  const config = {
    name,
    ...PACKAGE_MANAGERS[name]
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), '.package-manager.json'),
    JSON.stringify(config, null, 2)
  );
  
  return config;
}

/**
 * 現在のパッケージマネージャー設定を取得
 */
function getPackageManagerConfig() {
  const configPath = path.join(process.cwd(), '.package-manager.json');
  
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  
  const detected = detectPackageManager();
  return {
    name: detected,
    ...PACKAGE_MANAGERS[detected]
  };
}

// コマンドライン引数に応じた処理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--select')) {
    const selected = await selectPackageManager();
    const config = savePackageManagerConfig(selected);
    console.log(`パッケージマネージャーを ${selected} に設定しました`);
    return config;
  }
  
  if (args.includes('--get')) {
    const config = getPackageManagerConfig();
    console.log(JSON.stringify(config, null, 2));
    return config;
  }
  
  // デフォルトは現在の設定を返す
  return getPackageManagerConfig();
}

// モジュールとして使用する場合のエクスポート
module.exports = {
  detectPackageManager,
  selectPackageManager,
  savePackageManagerConfig,
  getPackageManagerConfig
};

// コマンドラインから直接実行された場合
if (require.main === module) {
  main().catch(console.error);
}

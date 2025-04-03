#!/usr/bin/env node

/**
 * フロントエンドフレームワーク設定スクリプト
 * プロジェクトで使用するフロントエンドフレームワークの設定を管理します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { getPackageManagerConfig } = require('./package-manager');

// サポートするフロントエンドフレームワーク
const FRONTEND_FRAMEWORKS = {
  react: {
    name: 'React',
    createCmd: {
      npm: 'npx create-react-app',
      yarn: 'yarn create react-app',
      pnpm: 'pnpm create react-app'
    },
    devServer: {
      port: 3000,
      command: 'start'
    },
    buildCommand: 'build',
    dependencies: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  vue: {
    name: 'Vue.js',
    createCmd: {
      npm: 'npx @vue/cli create',
      yarn: 'yarn create @vue/app',
      pnpm: 'pnpm create vue@latest'
    },
    devServer: {
      port: 8080,
      command: 'serve'
    },
    buildCommand: 'build',
    dependencies: [
      'vue',
      'vue-router',
      'pinia'
    ]
  },
  svelte: {
    name: 'Svelte',
    createCmd: {
      npm: 'npx degit sveltejs/template',
      yarn: 'npx degit sveltejs/template',
      pnpm: 'pnpm dlx degit sveltejs/template'
    },
    devServer: {
      port: 5000,
      command: 'dev'
    },
    buildCommand: 'build',
    dependencies: [
      'svelte',
      'svelte-navigator'
    ]
  },
  angular: {
    name: 'Angular',
    createCmd: {
      npm: 'npx @angular/cli new',
      yarn: 'yarn dlx @angular/cli new',
      pnpm: 'pnpm dlx @angular/cli new'
    },
    devServer: {
      port: 4200,
      command: 'serve'
    },
    buildCommand: 'build',
    dependencies: [
      '@angular/core',
      '@angular/router',
      '@angular/forms'
    ]
  },
  nextjs: {
    name: 'Next.js',
    createCmd: {
      npm: 'npx create-next-app',
      yarn: 'yarn create next-app',
      pnpm: 'pnpm create next-app'
    },
    devServer: {
      port: 3000,
      command: 'dev'
    },
    buildCommand: 'build',
    dependencies: [
      'next',
      'react',
      'react-dom'
    ]
  }
};

/**
 * フロントエンドフレームワークを対話的に選択
 */
async function selectFrontendFramework() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('フロントエンドフレームワークを選択してください:');
    
    Object.entries(FRONTEND_FRAMEWORKS).forEach(([key, framework], index) => {
      console.log(`${index + 1}. ${framework.name}`);
    });
    
    rl.question('選択 (デフォルト: React): ', (answer) => {
      rl.close();
      
      const selection = answer.trim();
      if (!selection) {
        return resolve('react');
      }
      
      const frameworks = Object.keys(FRONTEND_FRAMEWORKS);
      const index = parseInt(selection, 10) - 1;
      
      if (index >= 0 && index < frameworks.length) {
        return resolve(frameworks[index]);
      }
      
      return resolve('react');
    });
  });
}

/**
 * 選択されたフロントエンドフレームワークの設定を保存
 */
function saveFrontendConfig(key) {
  const config = {
    key,
    ...FRONTEND_FRAMEWORKS[key]
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), '.frontend-framework.json'),
    JSON.stringify(config, null, 2)
  );
  
  return config;
}

/**
 * 現在のフロントエンドフレームワーク設定を取得
 */
function getFrontendConfig() {
  const configPath = path.join(process.cwd(), '.frontend-framework.json');
  
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  
  // デフォルトはReact
  return {
    key: 'react',
    ...FRONTEND_FRAMEWORKS.react
  };
}

/**
 * 新しいフロントエンドプロジェクトを作成
 */
function createFrontendProject(framework, projectPath, options = {}) {
  const packageManager = getPackageManagerConfig();
  const createCommand = framework.createCmd[packageManager.name];
  
  if (!createCommand) {
    throw new Error(`${packageManager.name}で${framework.name}プロジェクトを作成する方法が定義されていません`);
  }
  
  const projectName = path.basename(projectPath);
  const command = `${createCommand} ${projectName} ${options.args || ''}`;
  
  console.log(`フロントエンドプロジェクトを作成中: ${command}`);
  
  try {
    execSync(command, {
      cwd: path.dirname(projectPath),
      stdio: 'inherit'
    });
    
    console.log(`${framework.name}プロジェクトが正常に作成されました: ${projectPath}`);
    return true;
  } catch (error) {
    console.error(`プロジェクト作成中にエラーが発生しました: ${error.message}`);
    return false;
  }
}

// コマンドライン引数に応じた処理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--select')) {
    const selected = await selectFrontendFramework();
    const config = saveFrontendConfig(selected);
    console.log(`フロントエンドフレームワークを ${config.name} に設定しました`);
    return config;
  }
  
  if (args.includes('--get')) {
    const config = getFrontendConfig();
    console.log(JSON.stringify(config, null, 2));
    return config;
  }
  
  if (args.includes('--create')) {
    const frameworkArg = args[args.indexOf('--create') + 1];
    const pathArg = args[args.indexOf('--create') + 2];
    
    if (!pathArg) {
      console.error('プロジェクトパスを指定してください');
      process.exit(1);
    }
    
    const framework = frameworkArg && FRONTEND_FRAMEWORKS[frameworkArg]
      ? FRONTEND_FRAMEWORKS[frameworkArg]
      : getFrontendConfig();
    
    return createFrontendProject(framework, pathArg);
  }
  
  // デフォルトは現在の設定を返す
  return getFrontendConfig();
}

// モジュールとして使用する場合のエクスポート
module.exports = {
  selectFrontendFramework,
  saveFrontendConfig,
  getFrontendConfig,
  createFrontendProject,
  FRONTEND_FRAMEWORKS
};

// コマンドラインから直接実行された場合
if (require.main === module) {
  main().catch(console.error);
}

#!/usr/bin/env node

/**
 * create-cmm-template
 * コンテナ化モジュラーモノリスアーキテクチャテンプレート作成ツール
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const { execSync } = require('child_process');

// バージョン情報
const packageJson = require('./package.json');
const version = packageJson.version;

// テンプレートのパス
const templatesDir = path.join(__dirname, 'templates');

// コマンドラインオプションの設定
const program = new commander.Command(packageJson.name)
  .version(version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--template <template-name>', 'テンプレートを指定 (pnpm-turbo, flexible)', 'flexible')
  .option('--use-npm', 'npmを使用')
  .option('--use-yarn', 'yarnを使用')
  .option('--use-pnpm', 'pnpmを使用')
  .option('--skip-install', 'パッケージのインストールをスキップ')
  .option('--verbose', '詳細なログを表示')
  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    ${chalk.green('create-cmm-template my-app')} - 新しいプロジェクトを作成`);
    console.log(`    ${chalk.green('create-cmm-template my-app --template=pnpm-turbo')} - pnpmとTurborepoを使用するテンプレートを選択`);
    console.log();
  })
  .parse(process.argv);

const options = program.opts();

// プロジェクト名が指定されていない場合
if (typeof projectName === 'undefined') {
  console.error('プロジェクト名を指定してください:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
  console.log();
  console.log('例:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-app')}`);
  process.exit(1);
}

// プロジェクトディレクトリのパス
const projectPath = path.resolve(projectName);
const projectDirName = path.basename(projectPath);

// 利用可能なテンプレート
const validTemplates = ['pnpm-turbo', 'flexible'];

// テンプレートの検証
if (!validTemplates.includes(options.template)) {
  console.error(`テンプレート "${options.template}" は存在しません。`);
  console.log(`利用可能なテンプレート: ${validTemplates.join(', ')}`);
  process.exit(1);
}

// メイン関数
async function run() {
  try {
    // プロジェクト作成の確認
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `${chalk.cyan(projectDirName)} ディレクトリにプロジェクトを作成しますか？`,
        default: true
      }
    ]);

    if (!confirm) {
      console.log('プロジェクト作成をキャンセルしました。');
      process.exit(0);
    }

    // パッケージマネージャーの選択
    let packageManager = 'npm';
    if (options.usePnpm) {
      packageManager = 'pnpm';
    } else if (options.useYarn) {
      packageManager = 'yarn';
    } else if (options.template === 'pnpm-turbo') {
      packageManager = 'pnpm';
    } else if (!options.useNpm) {
      const { manager } = await inquirer.prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'パッケージマネージャーを選択してください:',
          choices: [
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
            { name: 'pnpm', value: 'pnpm' }
          ],
          default: 'npm'
        }
      ]);
      packageManager = manager;
    }

    // テンプレートのパス
    const templatePath = path.join(templatesDir, options.template);

    // プロジェクトディレクトリの作成
    console.log(`🚀 ${chalk.cyan(projectDirName)} プロジェクトを作成しています...`);
    fs.ensureDirSync(projectName);

    // テンプレートのコピー
    const spinner = ora('テンプレートをコピーしています...').start();
    fs.copySync(templatePath, projectPath);
    spinner.succeed('テンプレートをコピーしました。');

    // package.jsonの更新
    const pkgJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = require(pkgJsonPath);
      pkgJson.name = projectDirName;
      pkgJson.version = '0.1.0';
      
      // pnpm-turboテンプレートでpnpm以外を使用する場合の警告
      if (options.template === 'pnpm-turbo' && packageManager !== 'pnpm') {
        console.warn(chalk.yellow('警告: pnpm-turboテンプレートはpnpmでの使用を推奨します。'));
      }
      
      // パッケージマネージャーの設定
      if (options.template === 'flexible') {
        pkgJson.packageManager = `${packageManager} || npm || yarn || pnpm`;
      } else if (packageManager === 'pnpm') {
        pkgJson.packageManager = 'pnpm@8.6.0';
      }
      
      fs.writeFileSync(
        pkgJsonPath,
        JSON.stringify(pkgJson, null, 2) + '\n'
      );
    }

    // 依存関係のインストール
    if (!options.skipInstall) {
      console.log();
      console.log('📦 依存関係をインストールしています...');
      
      const installSpinner = ora('パッケージをインストールしています...').start();
      
      try {
        const installCmd = getInstallCommand(packageManager);
        execSync(installCmd, { cwd: projectPath, stdio: options.verbose ? 'inherit' : 'pipe' });
        installSpinner.succeed('パッケージをインストールしました。');
      } catch (error) {
        installSpinner.fail('パッケージのインストールに失敗しました。');
        console.error(chalk.red('エラー:'), error.message);
        console.log();
        console.log(chalk.yellow('手動でインストールを実行してください:'));
        console.log(`  cd ${projectDirName}`);
        console.log(`  ${getInstallCommand(packageManager)}`);
      }
    }

    // 初期化スクリプトの実行
    if (fs.existsSync(path.join(projectPath, 'scripts', 'init-project.js'))) {
      console.log();
      console.log('🔧 プロジェクトの初期設定を行います...');
      
      const { runInit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'runInit',
          message: '初期化スクリプトを実行しますか？',
          default: true
        }
      ]);
      
      if (runInit) {
        try {
          const initCmd = `${packageManager} run init`;
          execSync(initCmd, { cwd: projectPath, stdio: 'inherit' });
        } catch (error) {
          console.error(chalk.red('エラー:'), '初期化スクリプトの実行に失敗しました。');
          console.log(chalk.yellow('手動で実行してください:'));
          console.log(`  cd ${projectDirName}`);
          console.log(`  ${packageManager} run init`);
        }
      }
    }

    // 完了メッセージ
    console.log();
    console.log(`🎉 ${chalk.green('成功!')} ${chalk.cyan(projectDirName)} プロジェクトが作成されました。`);
    console.log();
    console.log('次のステップ:');
    console.log(`  ${chalk.cyan('cd')} ${projectDirName}`);
    
    if (options.skipInstall) {
      console.log(`  ${chalk.cyan(getInstallCommand(packageManager))}`);
    }
    
    console.log(`  ${chalk.cyan(`${packageManager} run dev`)}`);
    console.log();
    console.log('詳細なドキュメントは以下を参照してください:');
    console.log(`  ${chalk.cyan('https://github.com/yourusername/create-cmm-template')}`);
    console.log();

  } catch (error) {
    console.error(chalk.red('エラー:'), error.message);
    process.exit(1);
  }
}

/**
 * パッケージマネージャーに応じたインストールコマンドを取得
 * @param {string} packageManager - パッケージマネージャー
 * @returns {string} - インストールコマンド
 */
function getInstallCommand(packageManager) {
  switch (packageManager) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'npm':
    default:
      return 'npm install';
  }
}

// スクリプトの実行
run();

/**
 * アセット同期スクリプト
 * 共有アセットを各モジュールに同期します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const rootDir = path.resolve(__dirname, '..');
const sharedAssetsDir = path.join(rootDir, 'assets');
const targetDirs = [
  path.join(rootDir, 'frontend', 'web', 'src', 'assets'),
  path.join(rootDir, 'frontend', 'mobile-svelte', 'src', 'assets'),
  path.join(rootDir, 'frontend', 'mobile-flutter', 'assets'),
  path.join(rootDir, 'modules', 'module-a', 'frontend', 'src', 'assets'),
  path.join(rootDir, 'modules', 'module-b', 'frontend', 'src', 'assets'),
];

// コマンドライン引数の解析
const args = process.argv.slice(2);
const options = {
  modules: null,
  dryRun: false,
  fileTypes: null,
};

args.forEach(arg => {
  if (arg.startsWith('--modules=')) {
    options.modules = arg.replace('--modules=', '').split(',');
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg.startsWith('--file-types=')) {
    options.fileTypes = arg.replace('--file-types=', '').split(',');
  }
});

// アセット同期関数
async function syncAssets() {
  console.log('🔄 アセット同期を開始します...');
  
  // 共有アセットディレクトリが存在するか確認
  if (!fs.existsSync(sharedAssetsDir)) {
    console.error(`❌ エラー: 共有アセットディレクトリが見つかりません: ${sharedAssetsDir}`);
    return;
  }

  // 各ターゲットディレクトリに対して処理
  for (const targetDir of targetDirs) {
    // モジュールフィルタリング
    if (options.modules) {
      const moduleName = targetDir.split(path.sep).find(part => part.startsWith('module-'));
      if (moduleName && !options.modules.includes(moduleName)) {
        continue;
      }
    }

    // ターゲットディレクトリが存在しない場合は作成
    if (!fs.existsSync(targetDir)) {
      if (options.dryRun) {
        console.log(`📝 [ドライラン] ディレクトリを作成します: ${targetDir}`);
      } else {
        console.log(`📁 ディレクトリを作成します: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    // rsyncコマンドを構築
    let rsyncCommand = `rsync -av --delete`;
    
    // ファイルタイプフィルタリング
    if (options.fileTypes) {
      const includePatterns = options.fileTypes.map(type => `--include="*.${type}"`).join(' ');
      rsyncCommand += ` ${includePatterns} --exclude="*"`;
    }
    
    // ドライランオプション
    if (options.dryRun) {
      rsyncCommand += ` --dry-run`;
    }
    
    // ソースとターゲットを追加
    rsyncCommand += ` ${sharedAssetsDir}/ ${targetDir}/`;
    
    try {
      if (options.dryRun) {
        console.log(`📝 [ドライラン] 実行コマンド: ${rsyncCommand}`);
      }
      
      // rsyncを実行
      const output = execSync(rsyncCommand, { encoding: 'utf8' });
      
      if (options.dryRun) {
        console.log(`📝 [ドライラン] ${targetDir} への同期をシミュレーションしました`);
        if (output) console.log(output);
      } else {
        console.log(`✅ ${targetDir} への同期が完了しました`);
      }
    } catch (error) {
      console.error(`❌ エラー: ${targetDir} への同期に失敗しました`);
      console.error(error.message);
    }
  }
  
  console.log('🎉 アセット同期が完了しました');
}

// スクリプト実行
syncAssets().catch(err => {
  console.error('❌ 予期せぬエラーが発生しました:', err);
  process.exit(1);
});

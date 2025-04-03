#!/usr/bin/env node

/**
 * アセット同期スクリプト
 * 共有アセットを各モジュールに同期します
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const minimist = require('minimist');

// コマンドライン引数の解析
const argv = minimist(process.argv.slice(2), {
  string: ['modules', 'file-types'],
  boolean: ['dry-run'],
  alias: {
    m: 'modules',
    t: 'file-types',
    d: 'dry-run'
  }
});

// 共有アセットディレクトリ
const sharedAssetsDir = path.join(__dirname, '../assets');

// ターゲットディレクトリのパターン
const targetPatterns = [
  'dashboard/*/src/assets',
  'modules/*/src/assets'
];

// アセット同期関数
async function syncAssets() {
  // 共有アセットディレクトリが存在するか確認
  if (!fs.existsSync(sharedAssetsDir)) {
    console.error(`❌ エラー: 共有アセットディレクトリが見つかりません: ${sharedAssetsDir}`);
    return;
  }

  console.log('🔄 アセット同期を開始します...');

  // ターゲットディレクトリの検索
  let targetDirs = [];
  
  for (const pattern of targetPatterns) {
    const matches = glob.sync(pattern, { cwd: path.join(__dirname, '..') });
    targetDirs = [...targetDirs, ...matches];
  }

  // モジュールフィルタリング
  if (argv.modules) {
    const moduleNames = argv.modules.split(',').map(m => m.trim());
    targetDirs = targetDirs.filter(dir => {
      return moduleNames.some(name => dir.includes(`/${name}/`));
    });
    console.log(`📋 モジュールフィルター: ${moduleNames.join(', ')}`);
  }

  // ファイルタイプフィルタリング
  let fileTypeFilter = '**/*';
  if (argv['file-types']) {
    const fileTypes = argv['file-types'].split(',').map(t => t.trim());
    fileTypeFilter = `**/*.{${fileTypes.join(',')}}`;
    console.log(`📋 ファイルタイプフィルター: ${fileTypes.join(', ')}`);
  }

  // ドライラン
  if (argv['dry-run']) {
    console.log('🔍 ドライラン: 実際のファイル変更は行いません');
  }

  // 各ターゲットディレクトリに対して処理
  for (const relativeDir of targetDirs) {
    const targetDir = path.join(__dirname, '..', relativeDir);
    
    // ターゲットディレクトリが存在しない場合は作成
    if (!fs.existsSync(targetDir)) {
      if (!argv['dry-run']) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      console.log(`📁 ディレクトリを作成${argv['dry-run'] ? 'します' : 'しました'}: ${relativeDir}`);
    }
    
    // アセットファイルをコピー
    const assetFiles = glob.sync(fileTypeFilter, { 
      cwd: sharedAssetsDir, 
      nodir: true 
    });
    
    for (const file of assetFiles) {
      const sourcePath = path.join(sharedAssetsDir, file);
      const targetPath = path.join(targetDir, file);
      
      // ターゲットディレクトリが存在しない場合は作成
      const targetDirPath = path.dirname(targetPath);
      if (!fs.existsSync(targetDirPath)) {
        if (!argv['dry-run']) {
          fs.mkdirSync(targetDirPath, { recursive: true });
        }
      }
      
      // ファイルをコピー
      if (!argv['dry-run']) {
        fs.copyFileSync(sourcePath, targetPath);
      }
      console.log(`📄 コピー${argv['dry-run'] ? 'します' : 'しました'}: ${file} -> ${relativeDir}`);
    }
  }

  console.log(`✅ アセット同期が${argv['dry-run'] ? '（ドライラン）' : ''}完了しました`);
}

// スクリプトが直接実行された場合
if (require.main === module) {
  syncAssets().catch(err => {
    console.error('❌ アセット同期中にエラーが発生しました:', err);
    process.exit(1);
  });
}

module.exports = syncAssets;

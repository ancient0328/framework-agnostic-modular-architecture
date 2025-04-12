/**
 * Japanese language messages for msyn
 */
module.exports = {
  // Common
  welcome: 'msyn - マルチフレームワーク対応アセット同期ツール',
  exitCtrlC: '終了するには Ctrl+C を押してください',
  
  // Config Wizard
  configWelcome: '📝 msyn 設定ウィザードへようこそ',
  configSourceDir: 'アセットのソースディレクトリを指定してください:',
  configAutoOptimize: 'SVGファイルを自動的に最適化しますか?',
  configWatchMode: '自動同期のための監視モードを有効にしますか?',
  configWatchDelay: 'ファイル監視の遅延時間(ms)を指定してください:',
  configWatchDelayInvalid: '正の数値を入力してください',
  configExistingTargets: '既存のフレームワークターゲット:',
  configKeepTargets: '既存のターゲットを保持しますか?',
  configFrameworkSelect: 'フレームワークを選択してください:',
  configFrameworkCategory: 'フレームワークのカテゴリを選択してください:',
  configFrameworkOther: 'その他（カスタム入力）',
  configFrameworkName: 'カスタムフレームワーク名を入力してください:',
  configFrameworkNameInvalid: 'フレームワーク名は空にできません',
  configTargetDir: 'ターゲットディレクトリを入力してください:',
  configTargetDirInvalid: 'ターゲットディレクトリは空にできません',
  configFormats: 'サポートする画像形式をカンマ区切りで入力してください:',
  configFormatsInvalid: '少なくとも1つの形式を入力してください',
  configFormatsSelect: 'サポートする画像形式を選択してください:',
  configFormatsRequired: '少なくとも1つの形式を選択してください',
  formatSvgRequiresLibrary: 'SVG (.svg) - {0}用の追加ライブラリが必要です',
  configAddMore: '別のフレームワークターゲットを追加しますか?',
  configComplete: '✅ 設定が完了しました！',
  configStartCommand: '以下のコマンドでアセット同期を開始できます:',
  configWatchCommand: 'または監視モードで実行:',
  configOldFormat: '⚠️ 古い設定形式が検出されました。新しい形式に変換しています...',
  configConverted: '✅ 設定を新しい形式に変換しました',
  
  // Asset Directories
  assetDirsAutoSync: '📂 アセットディレクトリの設定',
  assetDirsExplanation: '以下のアセットディレクトリが自動的に同期されます:',
  assetDirConfigured: '✅ {0}ディレクトリを設定しました: {1}',
  assetCustomAdd: 'カスタムアセットディレクトリを追加しますか？',
  assetCustomName: 'カスタムアセットフォルダ名を入力してください:',
  assetCustomNameInvalid: 'アセットフォルダ名は空にできません',
  assetDirsDisplay: 'アセットディレクトリ:',
  assetSourceDir: 'ソースディレクトリ',
  assetOptimizedDir: '最適化ディレクトリ',
  assetType: 'アセットタイプ',
  
  // Framework Categories
  frameworkCategoryWeb: 'Webフレームワーク',
  frameworkCategoryMobile: 'モバイルフレームワーク',
  frameworkCategoryNative: 'ネイティブフレームワーク',
  frameworkCategoryOther: 'その他（カスタム入力）',
  
  // Framework Detection
  frameworkDetected: '{0}が{1}で検出されました。このパスを使用しますか？',
  frameworkNotDetected: '{0}が検出されませんでした。{1}を作成しますか？',
  frameworkManualPath: 'このフレームワークのパスを入力してください:',
  targetConfigured: '✅ {1}の{0}ディレクトリを{2}に設定しました',
  
  // Directory Operations
  dirCreated: '📁 ディレクトリを作成しました: {0}',
  dirCreateError: '❌ ディレクトリの作成に失敗しました: {0}',
  
  // Language
  languageSelect: '言語を選択してください:',
  languageChanged: '✅ 言語を{0}に変更しました',
  languageInvalid: '❌ 無効な言語: {0}',
  languageValidValues: '有効な値: ja, en',
  
  // Sync
  syncStart: '🔄 アセット同期を開始しています...',
  syncNoOptimize: ' (SVG最適化は無効)',
  syncNoTargets: '⚠️ 同期するターゲットがありません',
  syncComplete: '🎉 アセット同期が完了しました！',
  syncTargetStart: '📂 フレームワーク \'{0}\' の同期を開始しています...',
  syncResult: '✅ {0}の同期結果: 追加={1}, 更新={2}, 削除={3}{4}',
  syncSvgOptimized: ', SVG最適化={0}',
  
  // File Operations
  fileAdded: '➕ ファイルを追加しました: {0}',
  fileUpdated: '🔄 ファイルを更新しました: {0}',
  fileDeleted: '➖ ファイルを削除しました: {0}',
  fileSvgOptimized: '🔧 SVGを最適化してコピーしました: {0}',
  fileError: '❌ ファイル操作に失敗しました: {0}',
  fileCreateDir: '📁 ディレクトリを作成しています: {0}',
  
  // Dry Run
  dryRunPrefix: '[ドライラン] ',
  dryRunAdd: '➕ [ドライラン] ファイルを追加します: {0}',
  dryRunUpdate: '🔄 [ドライラン] ファイルを更新します: {0}',
  dryRunDelete: '➖ [ドライラン] ファイルを削除します: {0}',
  dryRunOptimize: '🔧 [ドライラン] SVGを最適化します: {0}',
  
  // Watch Mode
  watchStart: '👀 アセット監視モードを開始しています...',
  watchDir: '📂 ディレクトリを監視しています: {0}',
  watchFileAdded: '➕ ファイルが追加されました: {0}',
  watchFileChanged: '🔄 ファイルが変更されました: {0}',
  watchFileDeleted: '➖ ファイルが削除されました: {0}',
  watchError: '❌ 監視エラー: {0}',
  
  // SVG Optimization
  optimizeStart: '🚀 SVG最適化を開始しています...',
  optimizeComplete: '✅ 最適化完了: {0} → {1}',
  optimizeError: '❌ 最適化エラー ({0}): {1}',
  optimizeResult: '🎉 {0}ファイルを最適化しました',
  optimizeOutput: '📁 最適化されたSVG出力ディレクトリ: {0}',
  optimizeSkipped: '⏭️ スキップ: {0} (既に存在します。上書きするには --force を使用してください)',
  
  // Config Management
  configSaved: '✅ 設定を保存しました: {0}',
  configLoaded: '設定を読み込みました: {0}',
  configLoadError: '❌ 設定の読み込みに失敗しました: {0}',
  configSaveError: '❌ 設定の保存に失敗しました: {0}',
  configReset: '✅ 設定をデフォルトにリセットしました',
  configCurrent: '📋 現在の設定:',
  configSourceDirDisplay: 'ソースディレクトリ: {0}',
  configOptimizeDisplay: '自動最適化: {0}',
  configWatchDisplay: '監視モード: {0}',
  configWatchDelayDisplay: '監視遅延: {0}ms',
  configTargetsDisplay: '📂 フレームワークターゲット:',
  configFormatsDisplay: '形式',
  configNoTargets: '設定されたターゲットはありません',
  
  // Common words
  enabled: '有効',
  disabled: '無効'
};

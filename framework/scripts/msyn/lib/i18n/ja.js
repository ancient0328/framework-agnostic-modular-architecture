/**
 * Japanese language messages for msyn
 */
module.exports = {
  // Common
  welcome: 'msyn - モジュラーモノリスのアセット同期ツール',
  exitCtrlC: '終了するには Ctrl+C を押してください',
  
  // Config Wizard
  configWelcome: '📝 msyn 設定ウィザードへようこそ',
  configSourceDir: 'アセットのソースディレクトリを指定してください:',
  configOptimizedDir: '最適化されたSVGの出力ディレクトリを指定してください:',
  configAutoOptimize: 'SVGファイルを自動的に最適化しますか?',
  configWatchDelay: 'ファイル監視の遅延時間(ms)を指定してください:',
  configModuleSettings: '📂 モジュール設定',
  configSelectModules: '同期対象のモジュールを選択してください:',
  configAddNewModule: '新しいモジュールを追加しますか?',
  configModuleName: 'モジュール名を入力してください:',
  configTargetDir: 'ターゲットディレクトリを入力してください:',
  configAddMore: '別のモジュールも追加しますか?',
  configComplete: '✅ 設定が完了しました！',
  configStartCommand: 'アセット同期を開始するには次のコマンドを実行してください:',
  configWatchCommand: 'または、監視モードで実行:',
  
  // Language
  languageSelect: '使用言語を選択してください:',
  languageChanged: '✅ 言語を{0}に変更しました',
  languageInvalid: '❌ 無効な言語です: {0}',
  languageValidValues: '有効な値: ja, en',
  
  // Sync
  syncStart: '🔄 アセット同期を開始します...',
  syncNoOptimize: '（SVG最適化無効）',
  syncNoModules: '⚠️ 同期対象のモジュールがありません',
  syncComplete: '🎉 アセット同期が完了しました！',
  syncModuleStart: '📂 モジュール \'{0}\' の同期を開始...',
  syncResult: '✅ {0} への同期結果: 追加={1}, 更新={2}, 削除={3}{4}',
  syncSvgOptimized: ', SVG最適化={0}',
  
  // File Operations
  fileAdded: '➕ ファイルを追加しました: {0}',
  fileUpdated: '🔄 ファイルを更新しました: {0}',
  fileDeleted: '➖ ファイルを削除しました: {0}',
  fileSvgOptimized: '🔧 SVGを最適化してコピーしました: {0}',
  fileError: '❌ ファイルの操作に失敗しました: {0}',
  fileCreateDir: '📁 ディレクトリを作成します: {0}',
  
  // Dry Run
  dryRunPrefix: '[DRY RUN] ',
  dryRunAdd: '➕ [DRY RUN] ファイルを追加します: {0}',
  dryRunUpdate: '🔄 [DRY RUN] ファイルを更新します: {0}',
  dryRunDelete: '➖ [DRY RUN] ファイルを削除します: {0}',
  dryRunOptimize: '🔧 [DRY RUN] SVGを最適化します: {0}',
  
  // Watch Mode
  watchStart: '👀 アセット監視を開始します...',
  watchDir: '📂 監視対象ディレクトリ: {0}',
  watchFileAdded: '➕ ファイルが追加されました: {0}',
  watchFileChanged: '🔄 ファイルが変更されました: {0}',
  watchFileDeleted: '➖ ファイルが削除されました: {0}',
  watchError: '❌ 監視エラー: {0}',
  
  // SVG Optimization
  optimizeStart: '🚀 SVG最適化を開始します...',
  optimizeComplete: '✅ 最適化完了: {0} → {1}',
  optimizeError: '❌ 最適化エラー ({0}): {1}',
  optimizeResult: '🎉 {0}個のファイルを最適化しました',
  optimizeOutput: '📁 最適化SVG出力先: {0}',
  optimizeSkipped: '⏭️ スキップ: {0} (既に存在します。上書きするには --force を使用してください)',
  
  // Config Management
  configSaved: '✅ 設定を保存しました: {0}',
  configLoaded: '設定を読み込みました: {0}',
  configLoadError: '❌ 設定の読み込みに失敗しました: {0}',
  configSaveError: '❌ 設定の保存に失敗しました: {0}',
  configReset: '✅ 設定をデフォルトにリセットしました',
  configCurrent: '📋 現在の設定:',
  configSourceDirDisplay: 'ソースディレクトリ: {0}',
  configOptimizedDirDisplay: '最適化ディレクトリ: {0}',
  configAutoOptimizeDisplay: '自動最適化: {0}',
  configWatchDelayDisplay: '監視遅延: {0}ms',
  configModulesDisplay: '📂 モジュール:',
  configModuleStatus: '{0} {1} → {2}',
  configModuleEnabled: '✅ 有効',
  configModuleDisabled: '❌ 無効'
};

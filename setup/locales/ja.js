/**
 * Japanese localization for setup wizard
 */
module.exports = {
  welcome: {
    title: "コンテナ化モジュラーモノリスフレームワーク セットアップウィザード",
    description: "このウィザードではコンテナ化モジュラーモノリスフレームワークの初期セットアップを行います。",
    instructions: "各質問に答えて、プロジェクトの構成をカスタマイズしてください。"
  },
  project: {
    namePrompt: "プロジェクト名を入力してください: ",
    nameConfirm: "プロジェクト名: "
  },
  modules: {
    frontendPrompt: "フロントエンドモジュールを使用しますか？ (y/n): ",
    backendPrompt: "バックエンドモジュールを使用しますか？ (y/n): "
  },
  frontend: {
    title: "使用するフロントエンドフレームワークを選択してください:",
    option1: "1. Svelte",
    option2: "2. React",
    option3: "3. Vue",
    prompt: "選択 (1-3): ",
    confirm: "選択されたフレームワーク: "
  },
  backend: {
    title: "使用するバックエンドフレームワークを選択してください:",
    option1: "1. Express",
    option2: "2. NestJS",
    option3: "3. Fastify",
    prompt: "選択 (1-3): ",
    confirm: "選択されたフレームワーク: "
  },
  packageManager: {
    title: "使用するパッケージマネージャーを選択してください:",
    option1: "1. npm (デフォルト)",
    option2: "2. yarn",
    option3: "3. pnpm",
    prompt: "選択 (1-3): ",
    confirm: "選択されたパッケージマネージャー: "
  },
  cloudProvider: {
    title: "使用するクラウドプロバイダーを選択してください:",
    option1: "1. なし (ローカル開発のみ)",
    option2: "2. AWS",
    option3: "3. GCP/Firebase",
    option4: "4. Azure",
    prompt: "選択 (1-4): ",
    confirm: "選択されたクラウドプロバイダー: "
  },
  confirmation: {
    title: "設定内容の確認",
    projectName: "プロジェクト名: ",
    frontend: "フロントエンド: ",
    frontendYes: "あり",
    frontendNo: "なし",
    frontendFramework: "- フレームワーク: ",
    backend: "バックエンド: ",
    backendYes: "あり",
    backendNo: "なし",
    backendFramework: "- フレームワーク: ",
    packageManager: "パッケージマネージャー: ",
    cloudProvider: "クラウドプロバイダー: ",
    prompt: "この設定でセットアップを実行しますか？ (y/n): "
  },
  initialization: {
    title: "プロジェクトの初期化",
    configSaved: "設定ファイルを保存しました: containerized-modular-monolith.config.json",
    creatingDirectories: "必要なディレクトリを作成しています...",
    setupFrontend: "フロントエンドモジュールをセットアップしています...",
    setupBackend: "バックエンドモジュールをセットアップしています...",
    installingDependencies: "依存関係をインストールしています..."
  },
  completion: {
    title: "セットアップ完了！",
    message: "コンテナ化モジュラーモノリスフレームワークのセットアップが完了しました。",
    startInstructions: "以下のコマンドでプロジェクトを開始できます:",
    frontendStart: "  npm run dev:frontend",
    backendStart: "  npm run dev:backend",
    documentation: "詳細なドキュメントは docs/ ディレクトリを参照してください。"
  },
  errors: {
    setupCancelled: "セットアップをキャンセルしました。もう一度実行して設定をやり直してください。",
    generalError: "エラーが発生しました: "
  }
};

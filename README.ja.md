# コンテナ化モジュラーモノリスフレームワーク

複数のクラウドプロバイダー、パッケージマネージャー、言語をサポートするコンテナ化モジュラーモノリスアプリケーション構築のための包括的なフレームワークです。

## 言語

- [English](./README.md)
- [日本語（このドキュメント）](./README.ja.md)

## 概要

このフレームワークは、様々なクラウド環境にコンテナ化してデプロイできるアプリケーションを構築するための構造化されたアプローチを提供します。モノリシックアーキテクチャの利点（シンプルさ、開発速度）とマイクロサービスの利点（モジュール性、スケーラビリティ）を組み合わせながら、それらの欠点を回避します。

## ドキュメント

詳細なドキュメントは`docs`ディレクトリで利用できます：

- [英語ドキュメント](./docs/en/index.md)
- [日本語ドキュメント](./docs/ja/index.md)

## 特徴

- **クラウド非依存アーキテクチャ**: AWS、GCP/Firebase、Azure、オンプレミスへのデプロイに対応
- **複数パッケージマネージャー対応**: npm（デフォルト）、yarn、pnpmと互換性あり
- **モノレポ管理**: 効率的なビルドのためのTurborepo統合
- **多言語対応**: 英語（デフォルト）と日本語のドキュメントとインターフェース
- **アセット同期**: モジュール間のアセット管理のための組み込み`msyn`ツール
- **モジュラー構造**: 明確に定義されたモジュール境界による関心の分離
- **コンテナ化**: Dockerベースの開発とデプロイメント
- **Infrastructure as Code**: サポートされる各クラウドプロバイダー向けのテンプレート

## ディレクトリ構造

```
framework/
├── core/                         # 共有コア機能
│   ├── api/                      # API定義とインターフェース
│   ├── auth/                     # 認証と認可
│   ├── communication/            # モジュール間通信
│   └── utils/                    # 共有ユーティリティ
├── frontend/                     # モジュール化されたフロントエンド
│   ├── core/                     # フロントエンドコア機能
│   │   ├── web/                  # Webアプリフロントエンド
│   │   │   ├── [framework-1]/    # 例: React、Svelte、Vueなど
│   │   │   ├── [framework-2]/    # 別のフレームワーク実装
│   │   │   └── [framework-n]/    # 追加のフレームワーク実装
│   │   └── mobile/               # モバイルアプリフロントエンド
│   │       ├── [framework-1]/    # 例: React Native、Flutterなど
│   │       └── [framework-2]/    # 別のフレームワーク実装
│   └── modules/                  # 機能モジュール
│       ├── registry.json         # モジュール登録情報
│       └── [module-name]/        # 各モジュール
│           ├── metadata.json     # モジュールメタデータ
│           ├── web/              # Webモジュール実装
│           │   ├── [framework-1]/# 選択したWebフレームワーク実装
│           │   ├── [framework-2]/# 別のフレームワーク実装（オプション）
│           │   └── [framework-n]/# 追加のフレームワーク実装（オプション）
│           └── mobile/           # モバイルモジュール実装
│               ├── [framework-1]/# 選択したモバイルフレームワーク実装
│               └── [framework-2]/# 別のフレームワーク実装（オプション）
├── backend/                      # モジュール化されたバックエンド
│   ├── api-gateway/              # APIゲートウェイ
│   ├── auth-service/             # 認証サービス
│   └── modules/                  # バックエンドモジュール
├── assets/                       # 共有アセット
│   ├── images/                   # オリジナル画像
│   ├── images-optimized/         # 最適化された画像
│   ├── fonts/                    # フォント
│   └── icons/                    # アイコン
├── docs/                         # ドキュメント
│   ├── api/            　　　　　  # API仕様
│   ├── architecture/             # アーキテクチャ設計
│   ├── diagrams/                 # 図表
│   ├── guides/                   # 開発ガイド
│   ├── learning/                 # 学習リソース
│   └── templates/                # テンプレート
├── scripts/                      # 開発・デプロイメントスクリプト
│   └──  msyn/                    # モジュール同期ツール
└── infrastructure/               # インフラストラクチャーコード
    ├── aws/                      # AWS固有の設定
    ├── gcp/                      # GCP固有の設定
    ├── azure/                    # Azure固有の設定
    └── on-premise/               # オンプレミス設定
```

## 始め方

### 前提条件

- Node.js 14以上
- DockerとDocker Compose
- Git

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/ancient0328/containerized-modular-monolith.git
cd containerized-modular-monolith

# npm（デフォルト）で依存関係をインストール
npm install

# または、yarnを使用
yarn

# または、pnpmを使用
pnpm install
```

### セットアップ

セットアップウィザードを実行して環境を設定します：

```bash
npm run setup
```

このウィザードでは以下の設定を行います：
1. クラウドプロバイダーの選択
2. 含めるモジュールの選択
3. 開発環境の設定

## パッケージマネージャーサポート

### npm（デフォルト）

```bash
# 依存関係のインストール
npm install

# スクリプトの実行
npm run dev

# 依存関係の追加
npm install package-name
```

### Yarn

```bash
# 依存関係のインストール
yarn

# スクリプトの実行
yarn dev

# 依存関係の追加
yarn add package-name
```

### pnpm

```bash
# 依存関係のインストール
pnpm install

# スクリプトの実行
pnpm dev

# 依存関係の追加
pnpm add package-name
```

## クラウドプロバイダーサポート

フレームワークは複数のクラウドプロバイダーの設定を想定しています：

- **AWS**: CloudFormationテンプレートとCDK設定
- **GCP/Firebase**: Terraform設定とFirebaseセットアップ
- **Azure**: ARMテンプレートとAzure DevOpsパイプライン
- **オンプレミス**: Docker ComposeとKubernetes設定

セットアップ時に希望のプロバイダーを選択するか、後で手動で設定することができます。

## モジュール同期ツール（msyn）

このフレームワークには、モジュール間のアセットを管理するための組み込みアセット同期ツール「msyn」が含まれています。このツールは、中央の`assets/`ディレクトリから各フロントエンド実装（React、Svelte、Vue、Flutter等）の適切なディレクトリに画像、フォント、アイコンなどのリソースを自動的に同期します。

### msynの主な機能

- **アセット同期**: 共通ディレクトリから各フレームワーク推奨の場所へのアセット同期
- **差分同期**: 変更されたファイルのみを効率的に同期
- **SVG最適化**: React Native互換のSVG最適化
- **監視モード**: ファイル変更を検知して自動同期
- **対話型設定**: ユーザーフレンドリーな設定ウィザード
- **多言語対応**: 日本語と英語のインターフェース

### フレームワーク別の推奨パス

msynは以下のような一般的なフレームワークの推奨パスに対応できます（例示）：

- **Svelte Kit**: `static/images/`
- **Next.js**: `public/images/`
- **React Native**: `src/assets/images/`
- **Flutter**: `assets/images/`
- **Angular**: `src/assets/images/`
- **Vue.js**: `public/images/`

これらは一般的な例であり、プロジェクトの構造に合わせてカスタマイズ可能です。

### msynの基本的な使い方

```bash
# 設定ウィザードの実行
node scripts/msyn/bin/msyn.js config

# アセットの同期
node scripts/msyn/bin/msyn.js sync

# 詳細出力
node scripts/msyn/bin/msyn.js sync --verbose

# 強制上書き
node scripts/msyn/bin/msyn.js sync --force

# 特定のモジュールのみ同期
node scripts/msyn/bin/msyn.js sync --modules=frontend/core/web/[framework-1],frontend/modules/[module-name]/web/[framework-2]

# 変更の監視
node scripts/msyn/bin/msyn.js watch

# SVGファイルの最適化
node scripts/msyn/bin/msyn.js optimize

# 言語の変更
node scripts/msyn/bin/msyn.js lang ja  # 日本語
node scripts/msyn/bin/msyn.js lang en  # 英語
```

### 設定ファイル

設定はプロジェクトルートの `.msyn.json` に保存されます。必要に応じて手動で編集することもできます：

```json
{
  "version": "1.0.0",
  "language": "ja",
  "sourceDir": "assets/images",
  "optimizedDir": "assets/images-optimized",
  "modules": [
    {
      "name": "frontend/core/web/[framework-1]",
      "targetDir": "public/images",
      "enabled": true
    },
    {
      "name": "frontend/modules/[module-name]/web/[framework-2]",
      "targetDir": "static/images",
      "enabled": true
    },
    {
      "name": "frontend/core/mobile/[framework-3]",
      "targetDir": "assets/images",
      "enabled": true
    }
  ],
  "options": {
    "autoOptimize": true,
    "watchDelay": 2000
  }
}
```

詳細な使用方法については、[msynのドキュメント](./scripts/msyn/README.ja.md)を参照してください。

## Turborepo統合

フレームワークは効率的なモノレポ管理のためにTurborepoと統合されています：

```bash
# すべてのワークスペースでスクリプトを実行
npx turbo run dev

# 特定のフレームワーク実装でスクリプトを実行
npx turbo run build --filter=frontend/core/web/[framework-1]

# 特定のモジュールでスクリプトを実行
npx turbo run build --filter=frontend/modules/[module-name]/web/[framework-2]
```

## 開発ワークフロー

1. **新しいモジュールの作成**: `templates/`ディレクトリからテンプレートを使用
2. **ローカル開発**: Docker Composeで実行
3. **アセットの同期**: msynツールを使用して共有アセットを各フレームワーク実装に同期
4. **テスト**: 個々のモジュールまたはアプリケーション全体のテストを実行
5. **デプロイ**: クラウド固有のデプロイメントスクリプトを使用

## マルチフレームワーク対応

このフレームワークは、複数のフロントエンドフレームワークでの実装をサポートしています。プロジェクトの要件に応じて、以下のようなフレームワークから選択できます：

- **Web**: React、Svelte、Vue、Angular、その他のモダンWebフレームワーク
- **モバイル**: React Native、Flutter、その他のクロスプラットフォームフレームワーク

各モジュールは、プロジェクトで採用するフレームワークごとに実装を提供できます。モジュールのメタデータ（`metadata.json`）には、対応するフレームワークとその実装パスが記述されます。

アプリケーションシェル（ダッシュボード）は、モジュールレジストリ（`registry.json`）を参照して利用可能なモジュールを検出し、適切なフレームワーク実装を動的に読み込みます。これにより、ユーザーは一貫したインターフェースを通じて、異なるフレームワークで実装されたモジュールにシームレスにアクセスできます。

### 技術選定の柔軟性

このアーキテクチャは特定のフレームワークに依存せず、プロジェクトの要件やチームのスキルセットに応じて最適な技術を選択できます。例えば：

- パフォーマンスが重視される部分にはSvelteを使用
- 複雑なUIコンポーネントにはReactを使用
- モバイルアプリにはFlutterを使用

など、モジュールごとに最適なフレームワークを選択することが可能です。

### 実装戦略

マルチフレームワーク環境での開発には、以下の戦略が有効です：

1. **モジュール間通信の標準化**: RESTful APIやGraphQLなど標準的な通信プロトコルを使用
2. **共通インターフェースの定義**: 各モジュールが実装すべきインターフェースを明確に定義
3. **メタデータ駆動アプローチ**: モジュールの機能や依存関係をメタデータで記述
4. **マイクロフロントエンド手法の活用**: WebComponentsやモジュールフェデレーションなどの技術を使用
5. **共通状態管理**: フレームワーク間で状態を共有するための仕組みを提供

これらの戦略により、異なるフレームワークで実装されたモジュールが連携して動作する統合環境を実現できます。

## ライセンス

MIT

---

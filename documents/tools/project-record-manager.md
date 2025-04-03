# Project Record Manager for CMM

## 概要

Project Record Manager (PRM) は、コンテナ化モジュラーモノリス (CMM) プロジェクトの開発記録を管理するためのツールです。アーキテクチャの決定、実装の詳細、変更履歴などを一貫したフォーマットで文書化し、プロジェクトの透明性と保守性を向上させます。

## 特徴

- **モジュール対応**: CMMの各モジュールに対応した記録管理
- **一貫したフォーマット**: 標準化されたテンプレートによる記録作成
- **複数パッケージマネージャー対応**: npm、yarn、pnpmをサポート
- **Turborepo統合**: pnpm-turboテンプレートとの連携
- **自動設定**: プロジェクト構造に基づく自動セットアップ

## インストール

CMM テンプレートには、Project Record Manager を簡単に統合するためのセットアップスクリプトが含まれています。

```bash
# PRMのセットアップ
node scripts/setup-prm.js
```

このコマンドは以下の処理を行います：

1. パッケージマネージャーの自動検出（npm/yarn/pnpm）
2. Project Record Manager のインストール
3. package.json へのスクリプト追加
4. CMM プロジェクト用の初期設定
5. モジュール構造の検出とディレクトリ設定

## 基本的な使用方法

### 記録の作成

```bash
# npm の場合
npm run prm:create

# yarn の場合
yarn prm:create

# pnpm の場合
pnpm prm:create
```

対話式のプロンプトに従って、以下の情報を入力します：

- タイトル: 記録のタイトル
- 説明: 記録の詳細な説明
- ディレクトリ: 記録を保存するディレクトリ（モジュール名）

### 設定の変更

```bash
npm run prm:config
```

設定可能な項目：

- 命名パターン
- ディレクトリ構造
- 記録テンプレート
- デフォルトディレクトリ

## CMM 特化機能

### モジュール構造の自動検出

Project Record Manager は CMM プロジェクトのモジュール構造を自動的に検出し、各モジュールに対応するドキュメントディレクトリを設定します。

```
documents/
└── architecture/
    ├── core/         # コア機能の記録
    ├── api-gateway/  # APIゲートウェイの記録
    └── modules/
        ├── module-a/ # モジュールAの記録
        ├── module-b/ # モジュールBの記録
        └── ...
```

### CMM 向けテンプレート

CMM プロジェクト用に最適化された記録テンプレートが提供されます。

```markdown
# {title}

## Overview

{description}

## Module Details

- **Module**: {module}
- **Dependencies**: 

## Implementation Details

- 

## Architecture Decisions

- 

## Notes

- 

## References

- 
```

## 高度な使用方法

### 記録の検証

既存の記録が正しいフォーマットに従っているかを検証します。

```bash
npm run prm -- validate
```

### 記録の要約

プロジェクト内の記録の要約を生成します。

```bash
npm run prm -- summary
```

### ディレクトリの一覧

設定されているディレクトリの一覧を表示します。

```bash
npm run prm -- list
```

## Turborepo との統合

pnpm-turbo テンプレートでは、Turborepo との統合が自動的に設定されます。`turbo.json` に PRM 関連のパイプラインが追加され、ワークスペース全体で一貫した記録管理が可能になります。

```json
{
  "pipeline": {
    "prm": {
      "cache": false,
      "dependsOn": []
    }
  }
}
```

## ベストプラクティス

### 記録を作成するタイミング

以下のようなタイミングで記録を作成することをお勧めします：

- 重要なアーキテクチャ上の決定を行ったとき
- 新しいモジュールを追加したとき
- 既存のモジュールに大きな変更を加えたとき
- 重要なバグを修正したとき
- 新しい技術やライブラリを導入したとき

### 記録の内容

効果的な記録には以下の要素を含めるようにしましょう：

- **明確なタイトル**: 何についての記録かが一目でわかるタイトル
- **詳細な説明**: 背景情報と目的
- **モジュールの詳細**: 影響を受けるモジュールと依存関係
- **実装の詳細**: 技術的な実装方法
- **アーキテクチャの決定**: なぜその設計を選んだのか
- **参考資料**: 関連するドキュメントやリソース

## トラブルシューティング

### セットアップに失敗する場合

- Node.js のバージョンが v14.0.0 以上であることを確認してください
- プロジェクトのルートディレクトリでコマンドを実行していることを確認してください
- 手動でインストールする場合は以下のコマンドを実行してください：

```bash
npm install project-record-manager
npx project-record-manager setup-cmm
```

### 記録の作成に失敗する場合

- 設定ファイルが正しく生成されているか確認してください
- `.prm-config.json` ファイルが存在するか確認してください
- 権限の問題がある場合は、ディレクトリのアクセス権を確認してください

## カスタマイズ

### テンプレートのカスタマイズ

独自のテンプレートを使用するには、以下のコマンドで設定を変更します：

```bash
npm run prm -- config template
```

プロンプトに従って新しいテンプレートを入力してください。

### 命名パターンのカスタマイズ

記録ファイルの命名パターンを変更するには：

```bash
npm run prm -- config pattern
```

## 参考資料

- [Project Record Manager GitHub リポジトリ](https://github.com/ancient0328/project-record-manager)
- [CMM テンプレート ドキュメント](https://github.com/ancient0328/containerized-modular-monolith)

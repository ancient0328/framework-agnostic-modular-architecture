# create-cmm-template

コンテナ化モジュラーモノリスアーキテクチャテンプレート作成ツール

[English](./README.md)

## 概要

`create-cmm-template`は、コンテナ化モジュラーモノリスアーキテクチャを簡単に始めるためのテンプレート作成ツールです。このツールを使用することで、モジュール化された構造と効率的な開発環境を持つプロジェクトを素早く立ち上げることができます。

## 特徴

- **柔軟なパッケージマネージャー対応**: npm、yarn、pnpmから選択可能
- **複数のテンプレート**: pnpm-turbo（高速ビルド）とflexible（柔軟な構成）の2種類
- **モジュール化された構造**: 機能ごとに分離されたモジュール設計
- **コンテナ化**: Dockerによる一貫した開発・本番環境
- **簡単な初期設定**: インタラクティブな設定プロセス

## インストール

```bash
# グローバルインストール
npm install -g create-cmm-template

# または直接実行
npx create-cmm-template my-app
```

## 使用方法

### 基本的な使用方法

```bash
# 新しいプロジェクトを作成
npx create-cmm-template my-app

# 特定のテンプレートを指定
npx create-cmm-template my-app --template=pnpm-turbo

# 特定のパッケージマネージャーを指定
npx create-cmm-template my-app --use-npm
npx create-cmm-template my-app --use-yarn
npx create-cmm-template my-app --use-pnpm
```

### オプション

| オプション | 説明 |
|------------|------|
| `--template=<template-name>` | テンプレートを指定（pnpm-turbo, flexible） |
| `--use-npm` | npmを使用 |
| `--use-yarn` | yarnを使用 |
| `--use-pnpm` | pnpmを使用 |
| `--skip-install` | パッケージのインストールをスキップ |
| `--verbose` | 詳細なログを表示 |

## テンプレート

### pnpm-turbo

pnpmとTurborepoを使用した高速ビルドと効率的な依存関係管理を特徴とするテンプレート。大規模プロジェクトに最適です。

**特徴**:
- pnpmによる効率的なパッケージ管理
- Turborepoによる高速ビルドとキャッシュ
- 最適化されたモノレポ構成

### flexible

様々なパッケージマネージャーとフロントエンドフレームワークをサポートする柔軟なテンプレート。既存のプロジェクトや特定の技術スタックに対応する必要がある場合に最適です。

**特徴**:
- 複数のパッケージマネージャー対応（npm、yarn、pnpm）
- 様々なフロントエンドフレームワーク対応
- カスタマイズ可能な構成

## プロジェクト構造

生成されるプロジェクトは以下の構造を持ちます：

```
my-app/
├── api-gateway/         # APIゲートウェイ
├── auth/                # 認証サービス
├── frontend/            # フロントエンド
│   ├── web/             # Webフロントエンド
│   └── mobile/          # モバイルアプリフロントエンド
├── modules/             # 機能モジュール
│   ├── _template_/      # モジュールテンプレート
│   ├── module-a/        # モジュールA
│   └── module-b/        # モジュールB
├── assets/              # 共有アセット
├── scripts/             # ユーティリティスクリプト
├── docs/                # ドキュメント
├── docker-compose.yml   # Docker Compose設定
└── package.json         # プロジェクト設定
```

## 初期設定

プロジェクト作成後、以下のコマンドで初期設定を行うことができます：

```bash
cd my-app
npm run init  # または yarn run init, pnpm run init
```

このスクリプトでは以下の設定が可能です：
- プロジェクト名、説明、バージョン、作者の設定
- 使用するモジュールの選択
- フロントエンドの設定

## Turborepoの最適化

pnpm-turboテンプレートでは、以下のコマンドでTurborepoの設定を最適化できます：

```bash
npm run optimize  # または yarn run optimize, pnpm run optimize
```

このスクリプトでは以下の設定が可能です：
- プロジェクトサイズに基づく最適化
- パフォーマンス設定
- キャッシュ戦略
- モジュール構造の最適化

## アセット管理

共有アセットは `assets/` ディレクトリに配置し、以下のコマンドで各モジュールに同期できます：

```bash
npm run sync-assets  # または yarn run sync-assets, pnpm run sync-assets
```

## ドキュメント

詳細なドキュメントは `docs/` ディレクトリにあります：

- [アーキテクチャ概要](./docs/architecture.md)
- [モジュール開発ガイド](./docs/module-development.md)
- [デプロイメントガイド](./docs/deployment.md)
- [トラブルシューティング](./docs/troubleshooting.md)

## ライセンス

MIT

## 作者

古川和博 (Kazuhiro Furukawa)

## 貢献

貢献は歓迎します！詳細は[CONTRIBUTING_ja.md](./CONTRIBUTING_ja.md)を参照してください。

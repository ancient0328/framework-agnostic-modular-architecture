# コンテナ化モジュラーモノリスアーキテクチャ

[English](./README.md)

## 概要

このリポジトリは、コンテナ化モジュラーモノリスアーキテクチャの実装テンプレートとツールを提供します。モノリシックアーキテクチャとマイクロサービスアーキテクチャの利点を組み合わせた設計アプローチを簡単に始めることができます。

## リポジトリ構成

このリポジトリには以下のコンポーネントが含まれています：

1. **[create-cmm-template](./create-cmm-template/)** - テンプレート作成ツール（npmパッケージ）
2. **[cmm-template-pnpm-turbo](./cmm-template-pnpm-turbo/)** - pnpmとTurborepoを使用した高速ビルド向けテンプレート
3. **[cmm-template-flexible](./cmm-template-flexible/)** - 柔軟なパッケージマネージャーとフロントエンドフレームワークに対応したテンプレート
4. **[cmm-template-comparison.md](./cmm-template-comparison.md)** - テンプレート比較ドキュメント

## 特徴

- **モジュール化**: 機能ごとに分離されたモジュール構造
- **コンテナ化**: Dockerによる一貫した環境
- **単一リポジトリ**: モノレポ方式による統合管理
- **独立デプロイ**: モジュールごとの個別デプロイが可能
- **柔軟性**: 多様なパッケージマネージャーとフロントエンドフレームワークに対応

## 使用方法

### テンプレート作成ツールのインストール

```bash
# グローバルインストール
npm install -g create-cmm-template

# または直接実行
npx create-cmm-template my-app
```

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

### テンプレートの直接使用

テンプレートを直接使用することもできます：

```bash
# pnpm-turboテンプレートを使用
git clone https://github.com/ancient0328/containerized-modular-monolith.git
cd containerized-modular-monolith/cmm-template-pnpm-turbo
pnpm install
pnpm run init
```

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

## アーキテクチャ

コンテナ化モジュラーモノリスアーキテクチャは、以下の設計原則に基づいています：

1. **明確なモジュール境界**: 各モジュールは明確に定義された責任を持ち、他のモジュールとの依存関係を最小限に抑えます。
2. **APIファースト**: モジュール間の通信は、明確に定義されたAPIを通じてのみ行います。
3. **独立したデータストア**: 各モジュールは独自のデータストアを持ちます。
4. **統一された認証・認可**: 認証・認可は中央集権的に管理します。
5. **段階的なスケーリング**: トラフィックや開発チームの規模に応じて、モジュールを個別にスケールアウトできます。

詳細なアーキテクチャドキュメントは各テンプレートの `docs/` ディレクトリにあります。

## ドキュメント

各テンプレートには詳細なドキュメントが含まれています：

- [pnpm-turboテンプレートのドキュメント](./cmm-template-pnpm-turbo/docs/README.md)
- [flexibleテンプレートのドキュメント](./cmm-template-flexible/docs/README.md)
- [テンプレート比較](./cmm-template-comparison.md)

## 貢献

貢献は歓迎します！詳細は[CONTRIBUTING.md](./create-cmm-template/CONTRIBUTING.md)を参照してください。

## ライセンス

MIT

## 作者

古川和博 (Kazuhiro Furukawa)

# コンテナ化モジュラーモノリスアーキテクチャ ドキュメント

このドキュメントでは、コンテナ化モジュラーモノリスアーキテクチャの概要、設計原則、実装ガイドラインについて説明します。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [設計原則](#設計原則)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [モジュール開発ガイド](#モジュール開発ガイド)
5. [APIゲートウェイ](#apiゲートウェイ)
6. [認証・認可](#認証認可)
7. [フロントエンド開発](#フロントエンド開発)
8. [デプロイメントガイド](#デプロイメントガイド)
9. [トラブルシューティング](#トラブルシューティング)

## アーキテクチャ概要

コンテナ化モジュラーモノリスアーキテクチャは、モノリシックアーキテクチャとマイクロサービスアーキテクチャの利点を組み合わせた設計アプローチです。

### 主な特徴

- **モジュール化**: 機能ごとに分離されたモジュール構造
- **コンテナ化**: Dockerによる一貫した環境
- **単一リポジトリ**: モノレポ方式による統合管理
- **独立デプロイ**: モジュールごとの個別デプロイが可能

### メリット

1. **開発の効率化**
   - モノレポによる統合的なコード管理
   - 共有コードやライブラリの効率的な利用
   - pnpmとTurborepoによる高速なビルドとキャッシュ

2. **段階的なスケーリング**
   - 初期はモノリスとして開発
   - 必要に応じて特定モジュールをマイクロサービス化
   - トラフィックに応じた個別スケーリング

3. **運用の簡素化**
   - 統一された開発・デプロイプロセス
   - 一貫したモニタリングとロギング
   - コンテナオーケストレーションの活用

## 設計原則

### 1. 明確なモジュール境界

各モジュールは明確に定義された責任を持ち、他のモジュールとの依存関係を最小限に抑えます。

### 2. APIファースト

モジュール間の通信は、明確に定義されたAPIを通じてのみ行います。内部実装の詳細は隠蔽します。

### 3. 独立したデータストア

各モジュールは独自のデータストアを持ち、他のモジュールのデータストアに直接アクセスしません。

### 4. 統一された認証・認可

認証・認可は中央集権的に管理し、各モジュールで一貫して適用します。

### 5. 段階的なスケーリング

トラフィックや開発チームの規模に応じて、モジュールを個別にスケールアウトできるようにします。

## ディレクトリ構造

```
containerized-modular-monolith/
├── api-gateway/         # APIゲートウェイ
├── auth/                # 認証サービス
├── frontend/            # フロントエンド
│   ├── web/             # Webフロントエンド
│   └── mobile/          # モバイルアプリフロントエンド
├── modules/             # 機能モジュール
│   ├── _template_/      # モジュールテンプレート
│   ├── module-a/        # モジュールA
│   └── module-b/        # モジュールB
├── shared/              # 共有コード
│   ├── utils/           # ユーティリティ関数
│   ├── components/      # 共通コンポーネント
│   ├── types/           # 共通型定義
│   └── constants/       # 定数
├── assets/              # 共有アセット
│   ├── images/          # 画像
│   ├── fonts/           # フォント
│   └── icons/           # アイコン
├── config/              # 設定ファイル
├── scripts/             # ユーティリティスクリプト
├── docs/                # ドキュメント
│   ├── api/             # API仕様
│   ├── architecture/    # アーキテクチャ設計
│   ├── diagrams/        # 図表
│   ├── guides/          # 開発ガイド
│   ├── learning/        # 学習リソース
│   └── templates/       # テンプレート
├── docker-compose.yml   # Docker Compose設定
├── package.json         # プロジェクト設定
└── README.md            # プロジェクト概要
```

## モジュール開発ガイド

### モジュールの構造

各モジュールは以下の構造を持ちます：

```
module-a/
├── src/
│   ├── api/             # APIエンドポイント
│   ├── controllers/     # コントローラー
│   ├── services/        # ビジネスロジック
│   ├── models/          # データモデル
│   ├── repositories/    # データアクセス
│   ├── utils/           # ユーティリティ
│   └── index.ts         # エントリーポイント
├── tests/               # テスト
├── Dockerfile           # Dockerファイル
├── package.json         # 依存関係
└── README.md            # モジュール説明
```

### 新しいモジュールの追加

1. `_template_` ディレクトリをコピー
2. モジュール名とパッケージ名を更新
3. `docker-compose.yml` にサービスを追加
4. APIゲートウェイの設定を更新

### モジュール間通信

モジュール間の通信は、APIゲートウェイを介して行います：

1. RESTful API
2. GraphQL
3. gRPC（パフォーマンスクリティカルな場合）

## APIゲートウェイ

APIゲートウェイは、クライアントからのリクエストを適切なモジュールにルーティングする役割を担います。

### 主な機能

- ルーティング
- 認証・認可
- レート制限
- リクエスト/レスポンスの変換
- キャッシュ
- ロギング

### 実装

Express.jsとhttp-proxy-middlewareを使用した実装例：

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// 認証ミドルウェア
const authMiddleware = require('./middleware/auth');

// モジュールAへのプロキシ
app.use('/api/module-a', 
  authMiddleware,
  createProxyMiddleware({ 
    target: 'http://module-a:40300',
    pathRewrite: {'^/api/module-a': ''},
  })
);

// モジュールBへのプロキシ
app.use('/api/module-b', 
  authMiddleware,
  createProxyMiddleware({ 
    target: 'http://module-b:40310',
    pathRewrite: {'^/api/module-b': ''},
  })
);

app.listen(40200, () => {
  console.log('APIゲートウェイが起動しました: http://localhost:40200');
});
```

## 認証・認可

認証・認可サービスは、ユーザー認証と権限管理を一元的に行います。

### 主な機能

- ユーザー登録・ログイン
- JWTトークン発行
- ロールベースのアクセス制御
- OAuth2.0サポート

### 実装

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// ユーザーログイン
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // ユーザー認証ロジック
  // ...
  
  // JWTトークン発行
  const token = jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

app.listen(40250, () => {
  console.log('認証サービスが起動しました: http://localhost:40250');
});
```

## フロントエンド開発

フロントエンド開発は、Webアプリケーションとモバイルアプリケーションをサポートしています。

### Web開発

- React/Vue/Svelteなどのフレームワーク
- TypeScriptによる型安全性
- TailwindCSSなどのユーティリティファーストCSS

### モバイル開発

- React Native
- Capacitor
- Flutter

### アセット管理

共有アセットは `assets/` ディレクトリに配置し、各モジュールに自動的に同期されます：

```bash
# アセットの同期
pnpm run sync-assets

# 特定のモジュールにのみ同期
pnpm run sync-assets -- --modules=module-a,module-b
```

## デプロイメントガイド

### 開発環境

```bash
# 開発サーバーの起動
pnpm dev

# Docker Composeによる起動
docker-compose up -d
```

### 本番環境

1. コンテナイメージのビルド
2. コンテナレジストリへのプッシュ
3. Kubernetes/ECS/GKEなどへのデプロイ

```bash
# ビルド
pnpm build

# コンテナイメージのビルドとプッシュ
docker-compose build
docker-compose push
```

### CI/CD

GitHub Actions、Jenkins、CircleCIなどを使用した継続的インテグレーション・デプロイメントをサポートしています。

## トラブルシューティング

### よくある問題と解決策

1. **モジュール間通信エラー**
   - APIゲートウェイの設定を確認
   - ネットワーク接続を確認

2. **ビルドエラー**
   - Turborepoのキャッシュをクリア: `pnpm dlx turbo clean`
   - 依存関係を再インストール: `pnpm install`

3. **コンテナ起動エラー**
   - ログを確認: `docker-compose logs -f <service-name>`
   - ポート競合を確認

4. **パフォーマンス問題**
   - Turborepoの設定を最適化: `pnpm optimize`
   - キャッシュ戦略を見直し

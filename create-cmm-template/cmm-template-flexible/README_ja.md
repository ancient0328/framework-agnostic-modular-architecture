# コンテナ化モジュラーモノリスアーキテクチャ ドキュメント

このドキュメントでは、柔軟なパッケージマネージャーとフロントエンドフレームワークをサポートするコンテナ化モジュラーモノリスアーキテクチャの概要、設計原則、実装ガイドラインについて説明します。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [設計原則](#設計原則)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [パッケージマネージャー](#パッケージマネージャー)
5. [フロントエンドフレームワーク](#フロントエンドフレームワーク)
6. [モジュール開発ガイド](#モジュール開発ガイド)
7. [APIゲートウェイ](#apiゲートウェイ)
8. [認証・認可](#認証認可)
9. [デプロイメントガイド](#デプロイメントガイド)
10. [トラブルシューティング](#トラブルシューティング)

## アーキテクチャ概要

コンテナ化モジュラーモノリスアーキテクチャは、モノリシックアーキテクチャとマイクロサービスアーキテクチャの利点を組み合わせた設計アプローチです。このフレキシブル版テンプレートでは、様々なパッケージマネージャーとフロントエンドフレームワークをサポートしています。

### 主な特徴

- **モジュール化**: 機能ごとに分離されたモジュール構造
- **コンテナ化**: Dockerによる一貫した環境
- **単一リポジトリ**: モノレポ方式による統合管理
- **独立デプロイ**: モジュールごとの個別デプロイが可能
- **柔軟性**: 多様なパッケージマネージャーとフロントエンドフレームワークに対応

### メリット

1. **開発の効率化**
   - モノレポによる統合的なコード管理
   - 共有リソースの効率的な利用
   - 既存の開発環境や習慣を尊重した柔軟な設計

2. **段階的なスケーリング**
   - 初期はモノリスとして開発
   - 必要に応じて特定モジュールをマイクロサービス化
   - トラフィックに応じた個別スケーリング

3. **運用の簡素化**
   - 統一された開発・デプロイプロセス
   - 一貫したモニタリングとロギング
   - コンテナオーケストレーションの活用

## 設計原則

### 1. 柔軟性と互換性

様々な開発環境や技術スタックに対応し、既存のプロジェクトにも容易に適用できるようにします。

### 2. 明確なモジュール境界

各モジュールは明確に定義された責任を持ち、他のモジュールとの依存関係を最小限に抑えます。

### 3. APIファースト

モジュール間の通信は、明確に定義されたAPIを通じてのみ行います。内部実装の詳細は隠蔽します。

### 4. 独立したデータストア

各モジュールは独自のデータストアを持ち、他のモジュールのデータストアに直接アクセスしません。

### 5. 段階的な採用

既存のプロジェクトに段階的に適用できるよう、モジュール単位での導入が可能な設計にします。

## ディレクトリ構造

```
containerized-modular-monolith/
├── api-gateway/        # APIゲートウェイ
├── auth/               # 認証サービス
├── frontend/           # フロントエンド
│   ├── web/            # Webアプリケーション
│   └── mobile/         # モバイルアプリケーション
├── modules/            # 機能モジュール
│   ├── _template_/     # 新規モジュールのテンプレート
│   │   ├── backend/    # バックエンド
│   │   └── frontend/   # フロントエンド（必要に応じて）
│   ├── module-a/       # モジュールA
│   └── module-b/       # モジュールB
├── assets/             # 共有アセット
├── scripts/            # ユーティリティスクリプト
├── docs/               # ドキュメント
├── docker-compose.yml  # Docker構成
└── package.json        # プロジェクト設定
```

## パッケージマネージャー

このテンプレートは、複数のパッケージマネージャーをサポートしています：

- npm
- yarn
- pnpm

### パッケージマネージャーの選択

プロジェクト初期化時に、希望するパッケージマネージャーを選択できます：

```bash
# パッケージマネージャーの選択
node package-manager.js --select
```

または、自動検出を利用することもできます：

```bash
# 既存のパッケージマネージャーを自動検出
node package-manager.js --detect
```

### パッケージマネージャー設定ファイル

選択したパッケージマネージャーは `.package-manager.json` ファイルに保存されます：

```json
{
  "packageManager": "npm",
  "installCommand": "npm install",
  "runCommand": "npm run"
}
```

## フロントエンドフレームワーク

このテンプレートは、様々なフロントエンドフレームワークをサポートしています：

- React
- Vue
- Svelte
- Angular
- Next.js

### フロントエンドフレームワークの選択

プロジェクト初期化時に、希望するフロントエンドフレームワークを選択できます：

```bash
# フロントエンドフレームワークの選択
node frontend-config.js --select
```

### フロントエンド設定ファイル

選択したフロントエンドフレームワークは `.frontend-framework.json` ファイルに保存されます：

```json
{
  "framework": "react",
  "version": "18.2.0",
  "typescript": true,
  "cssFramework": "tailwindcss"
}
```

## モジュール開発ガイド

### モジュールの構造

各モジュールは以下の構造を持ちます：

```
module-a/
├── backend/
│   ├── src/
│   │   ├── api/             # APIエンドポイント
│   │   ├── controllers/     # コントローラー
│   │   ├── services/        # ビジネスロジック
│   │   ├── models/          # データモデル
│   │   ├── repositories/    # データアクセス
│   │   ├── utils/           # ユーティリティ
│   │   └── index.ts         # エントリーポイント
│   ├── tests/               # テスト
│   ├── Dockerfile           # Dockerファイル
│   └── package.json         # 依存関係
├── frontend/                # モジュール固有のフロントエンド（必要に応じて）
│   ├── src/
│   │   ├── components/      # コンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── pages/           # ページ
│   │   └── index.ts         # エントリーポイント
│   ├── tests/               # テスト
│   └── package.json         # 依存関係
└── README.md                # モジュール説明
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
3. WebSocket（リアルタイム通信の場合）

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

## デプロイメントガイド

### 開発環境

```bash
# 開発サーバーの起動
npm run dev
# または
yarn dev
# または
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
npm run build
# または
yarn build
# または
pnpm build

# コンテナイメージのビルドとプッシュ
docker-compose build
docker-compose push
```

### CI/CD

GitHub Actions、Jenkins、CircleCIなどを使用した継続的インテグレーション・デプロイメントをサポートしています。

## トラブルシューティング

### よくある問題と解決策

1. **パッケージマネージャーの問題**
   - `.package-manager.json` ファイルを確認
   - `node package-manager.js --detect` を実行して再検出

2. **フロントエンドフレームワークの問題**
   - `.frontend-framework.json` ファイルを確認
   - `node frontend-config.js --select` を実行して再設定

3. **モジュール間通信エラー**
   - APIゲートウェイの設定を確認
   - ネットワーク接続を確認

4. **コンテナ起動エラー**
   - ログを確認: `docker-compose logs -f <service-name>`
   - ポート競合を確認

5. **アセット同期の問題**
   - `npm run sync-assets` を実行してアセットを再同期

# アセット同期ツール（msyn）

## 概要

`msyn`ツールは、コンテナ化モジュラーモノリスフレームワーク内の異なるフロントエンドフレームワーク実装間でアセットを効率的に管理・同期するために設計されています。これにより、画像、フォント、アイコンなどのリソースがすべてのフロントエンドモジュールで一貫して利用可能になります。

## 機能

- **差分同期**: 変更されたファイルのみを同期
- **SVG最適化**: 同期中にSVGファイルを自動的に最適化
- **監視モード**: 変更を監視してリアルタイムで同期
- **対話型設定**: 対話式プロンプトによる簡単なセットアップ
- **多言語対応**: アセットの国際化をサポート
- **フレームワーク固有のパス**: 各フレームワークに適したパスへのアセットの自動マッピング

## インストール

`msyn`ツールはコンテナ化モジュラーモノリスフレームワークに含まれています。追加のインストールは必要ありません。

## 設定

### 設定ファイル

このツールはプロジェクトルートの`.msyn.json`設定ファイルを使用します。以下は設定例です：

```json
{
  "sourceDir": "assets",
  "targets": [
    {
      "name": "react-app",
      "path": "modules/frontend/react-app/public/assets",
      "frameworks": ["react"]
    },
    {
      "name": "svelte-app",
      "path": "modules/frontend/svelte-app/static/assets",
      "frameworks": ["svelte"]
    },
    {
      "name": "vue-app",
      "path": "modules/frontend/vue-app/public/assets",
      "frameworks": ["vue"]
    },
    {
      "name": "flutter-app",
      "path": "modules/frontend/flutter-app/assets",
      "frameworks": ["flutter"]
    }
  ],
  "options": {
    "optimizeSvg": true,
    "watchMode": false,
    "verbose": true
  }
}
```

### 設定の作成

新しい設定ファイルを作成するには、次のコマンドを実行します：

```bash
npx msyn init
```

これにより、対話式のセットアッププロセスが開始されます。

## 使用方法

### 基本的な同期

すべてのターゲットフレームワークにアセットを同期するには：

```bash
npx msyn sync
```

### 監視モード

変更を継続的に監視して自動的に同期するには：

```bash
npx msyn watch
```

### 選択的な同期

特定のターゲットにアセットを同期するには：

```bash
npx msyn sync --targets react-app,vue-app
```

### 特定のファイルの同期

特定のファイルやディレクトリのみを同期するには：

```bash
npx msyn sync --files images/logo.png,fonts
```

## フレームワーク固有のパス

このツールは、各フレームワークに適したパスにアセットを自動的にマッピングします：

- **React/Next.js**: `public/assets`
- **Svelte Kit**: `static/assets`
- **Vue.js**: `public/assets`
- **Flutter**: `assets`
- **React Native**: `assets`

これらのパスは設定ファイルでカスタマイズできます。

## ベストプラクティス

- **アセットの論理的な整理**: アセットをタイプ（画像、フォント、アイコン）ごとにグループ化
- **一貫した命名の使用**: 一貫した命名規則を採用
- **同期前の最適化**: 大きなアセットは追加前に事前最適化
- **定期的な同期**: 開発中に定期的に同期を実行
- **バージョン管理**: 設定ファイルをバージョン管理に含める

## トラブルシューティング

### 一般的な問題

#### ファイルが同期されない

ファイルが同期されない場合：
1. ファイルのアクセス権を確認
2. 設定ファイル内のパスを確認
3. ソースファイルが存在することを確認

#### パフォーマンスの問題

同期が遅い場合：
1. アセットの数を減らす
2. 開発用にSVG最適化を無効にする
3. 選択的な同期を使用する

## 高度な設定

### カスタム変換

同期中にアセットを処理するためのカスタム変換を追加できます：

```json
{
  "transformations": [
    {
      "pattern": "*.jpg",
      "command": "imagemin --quality=80"
    }
  ]
}
```

### 環境固有の設定

環境固有の設定を作成できます：

```bash
npx msyn sync --config .msyn.dev.json
```

## 貢献

`msyn`ツールの改善への貢献を歓迎します。詳細については、[貢献ガイド](./contributing.md)を参照してください。

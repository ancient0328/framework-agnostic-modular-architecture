# msyn - マルチフレームワーク対応アセット同期ツール

複数のフレームワークにまたがるプロジェクトのための総合的なアセット管理・同期ツールです。Web、モバイル、ネイティブアプリケーション間でアセットを効率的に管理・最適化します。

## 主な機能

- **フレームワーク自動検出**: プロジェクト内のフレームワークを自動検出
- **複数アセットタイプ対応**: 画像、アイコン、フォント、およびカスタムアセットタイプをサポート
- **アセット同期**: 共通ディレクトリから各フレームワーク固有の場所へのアセット同期
- **SVG最適化**: 互換性とパフォーマンス向上のためのSVG最適化
- **監視モード**: ファイル変更を検知して自動同期
- **対話型設定**: スマートなデフォルト値を持つユーザーフレンドリーな設定ウィザード
- **多言語対応**: 日本語と英語のインターフェース

## インストール

```bash
# npmでグローバルインストール
npm install -g msyn

# または、プロジェクト依存関係としてインストール
npm install --save-dev msyn

# pnpmを使用する場合
pnpm install --save-dev msyn
```

## 使い方

### 初期設定

初めて使用する場合は、設定ウィザードを実行してください：

```bash
npx msyn config
```

このウィザードでは以下の設定を対話形式で行います：
- アセットディレクトリ（画像、アイコン、フォント）の設定
- フレームワークの検出と設定
- 監視モードのパラメータ設定

### アセット同期

```bash
# 基本的な同期
npx msyn sync

# 詳細出力
npx msyn sync --verbose

# 強制上書き
npx msyn sync --force
```

### 監視モード

```bash
# 監視モードを開始
npx msyn watch

# 詳細出力付き
npx msyn watch --verbose
```

## 設定

### アセットディレクトリ構造

msyn v1.1.0では、標準化されたアセットディレクトリ構造を使用します：

```
assets/
  ├── images/
  │   └── .optimized/  (自動的に作成されます)
  ├── icons/
  │   └── .optimized/  (自動的に作成されます)
  └── fonts/
```

これらのディレクトリは設定時に自動的に作成され、同期に使用されます。最適化ディレクトリは画像アセットのみに作成されます。

### フレームワーク検出

msynはプロジェクト内のフレームワークを以下の方法で自動検出します：
- パッケージの依存関係
- 設定ファイル
- ディレクトリ構造

サポートされているフレームワーク：

**Webフレームワーク**:
- Next.js
- React
- Remix
- Vue
- Nuxt.js
- Angular
- Svelte
- SvelteKit
- SolidJS
- Astro

**モバイルフレームワーク**:
- React Native
- Expo
- Flutter
- Ionic
- Capacitor

**ネイティブフレームワーク**:
- Swift (iOS)
- Kotlin (Android)
- Xamarin

### デフォルトアセットパス

msynは各フレームワークに対して以下の推奨パスを使用します：

- **Next.js/React/Remix**: `public/images/`, `public/icons/`, `public/fonts/`
- **SvelteKit**: `static/images/`, `static/icons/`, `static/fonts/`
- **Angular**: `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`
- **React Native**: `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`
- **Flutter**: `assets/images/`, `assets/icons/`, `assets/fonts/`
- **Swift**: `Resources/Images/`, `Resources/Icons/`, `Resources/Fonts/`
- **Kotlin**: `res/drawable/`, `res/drawable/`, `res/font/`

### 設定ファイル

設定はプロジェクトルートの `.msyn.json` に保存されます。例：

```json
{
  "version": "1.1.0",
  "language": "ja",
  "assets": {
    "images": {
      "source": "assets/images/",
      "optimized": "assets/images/.optimized/"
    },
    "icons": {
      "source": "assets/icons/",
      "optimized": "assets/icons/.optimized/"
    },
    "fonts": {
      "source": "assets/fonts/",
      "optimized": null
    }
  },
  "targets": [
    {
      "framework": "nextjs",
      "type": "web",
      "destination": "/path/to/nextjs/public/images",
      "formats": ["webp", "jpg", "png", "svg"],
      "assetType": "images"
    },
    {
      "framework": "reactnative",
      "type": "mobile",
      "destination": "/path/to/reactnative/src/assets/images",
      "formats": ["png", "jpg", "webp"],
      "assetType": "images"
    }
  ],
  "watch": true,
  "optimize": true,
  "watchDelay": 2000
}
```

## 環境変数

- `MSYN_LANG`: 言語設定（en/ja）

## 依存関係

- Node.js 14以上
- chokidar（ファイル監視）
- svgo（SVG最適化）
- inquirer（対話型インターフェース）
- commander（コマンドライン解析）
- glob（ファイルパターンマッチング）

## ライセンス

MIT

---

[English README here](./README.md)

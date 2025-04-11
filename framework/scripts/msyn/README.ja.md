# msyn - モジュール同期ツール

Framework-Agnostic Modular Architecture (FAMA)のための総合的なアセット管理・同期ツールです。複数のフレームワークやモジュールにまたがるアセットを効率的に管理します。

## 主な機能

- **アセット同期**: 共通ディレクトリから各フレームワーク推奨の場所へのアセット同期
- **差分同期**: 変更されたファイルのみを効率的に同期
- **SVG最適化**: React Native互換のSVG最適化
- **監視モード**: ファイル変更を検知して自動同期
- **対話型設定**: ユーザーフレンドリーな設定ウィザード
- **多言語対応**: 日本語と英語のインターフェース

## インストール

```bash
# npmでグローバルインストール
npm install -g msyn

# または、プロジェクト依存関係としてインストール
npm install --save-dev msyn
```

## 使い方

### 初期設定

初めて使用する場合は、設定ウィザードを実行してください：

```bash
msyn config
```

このウィザードでは以下の設定を対話形式で行います：
- ソースディレクトリとターゲットディレクトリの指定
- 同期対象モジュールの選択
- SVG最適化オプションの設定
- 監視モードのパラメータ設定

### アセット同期

```bash
# 基本的な同期
msyn sync

# 詳細出力
msyn sync --verbose

# 強制上書き
msyn sync --force

# 特定のモジュールのみ同期
msyn sync --modules=dashboard/web-svelte,dashboard/mobile-flutter
```

### 監視モード

```bash
# 監視モードを開始
msyn watch

# 詳細出力付き
msyn watch --verbose
```

### SVG最適化

```bash
# SVGファイルの最適化
msyn optimize

# 強制的に再最適化
msyn optimize --force
```

### 設定管理

```bash
# 設定ウィザードを実行
msyn config

# 現在の設定を表示
msyn config --list

# 設定をリセット
msyn config --reset
```

### 言語設定

```bash
# 対話形式で言語を変更
msyn lang

# 直接言語を指定
msyn lang en  # 英語
msyn lang ja  # 日本語

# 単一コマンドで特定の言語を使用
msyn sync --lang ja
```

## 設定ファイル

設定はプロジェクトルートの `.msyn.json` に保存されます。必要に応じて手動で編集することもできます：

```json
{
  "version": "1.0.0",
  "language": "ja",
  "sourceDir": "assets/images",
  "optimizedDir": "assets/images-optimized",
  "modules": [
    {
      "name": "dashboard/web-svelte",
      "targetDir": "static/images",
      "enabled": true
    },
    {
      "name": "dashboard/mobile-flutter",
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

## フレームワーク別の推奨パス

msynは以下のフレームワークの推奨パスに対応しています：

- **Svelte Kit**: `static/images/`
- **Next.js**: `public/images/`
- **React Native**: `src/assets/images/`
- **Flutter**: `assets/images/`
- **Angular**: `src/assets/images/`
- **Vue.js**: `public/images/`

## 環境変数

- `MSYN_LANG`: 言語設定（en/ja）

## 依存関係

- Node.js 14以上
- chokidar（ファイル監視）
- svgo（SVG最適化）
- inquirer（対話型インターフェース）
- commander（コマンドライン解析）

## ライセンス

MIT

---

[English README here](./README.md)

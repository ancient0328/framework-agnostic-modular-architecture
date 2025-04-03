# モジュールテンプレート

このディレクトリは新しいモジュールを作成するためのテンプレートです。新しいモジュールを追加する際は、このディレクトリをコピーして使用してください。

## 使用方法

1. このディレクトリを新しいモジュール名でコピーします：

```bash
cp -r modules/_template_ modules/your-module-name
```

2. 必要に応じてパッケージ名やポート番号などを変更します：
   - `backend/package.json`の`name`フィールド
   - `frontend/package.json`の`name`フィールド
   - `Dockerfile`の`EXPOSE`ポート番号

3. モジュールを`docker-compose.yml`に追加します：

```yaml
your-module-name:
  build:
    context: ./modules/your-module-name
  ports:
    - "5x00:5x00"  # 適切なポート番号を割り当て
  environment:
    - NODE_ENV=development
  depends_on:
    - database
```

4. APIゲートウェイの設定を更新して、新しいモジュールへのルーティングを追加します。

## ディレクトリ構造

```
modules/your-module-name/
├── backend/           # バックエンド
│   ├── src/           # ソースコード
│   ├── tests/         # テスト
│   ├── package.json   # 依存関係
│   └── tsconfig.json  # TypeScript設定
├── frontend/          # フロントエンド
│   ├── src/           # ソースコード
│   ├── tests/         # テスト
│   ├── package.json   # 依存関係
│   └── vite.config.js # Vite設定
└── Dockerfile         # Dockerビルド設定
```

## 開発

### バックエンド開発

```bash
cd modules/your-module-name/backend
pnpm install
pnpm dev
```

### フロントエンド開発

```bash
cd modules/your-module-name/frontend
pnpm install
pnpm dev
```

### Docker ビルド

```bash
docker build -t your-module-name -f modules/your-module-name/Dockerfile modules/your-module-name
```

## ベストプラクティス

1. **モジュール境界の明確化**: 他のモジュールとの依存関係を最小限に保ちます
2. **APIの文書化**: 提供するAPIエンドポイントを明確に文書化します
3. **テストの充実**: ユニットテストと統合テストを作成します
4. **エラー処理**: 適切なエラー処理とログ記録を実装します
5. **設定の外部化**: 環境変数や設定ファイルを使用して設定を外部化します

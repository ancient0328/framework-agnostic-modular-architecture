FROM node:18-alpine AS builder

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# 依存関係のインストール
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ソースコードのコピーとビルド
COPY . .
RUN pnpm build

# 実行イメージ
FROM node:18-alpine AS runner

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# 本番依存関係のみインストール
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# ビルド済みアプリケーションのコピー
COPY --from=builder /app/dist ./dist

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

EXPOSE 4000

CMD ["node", "dist/index.js"]

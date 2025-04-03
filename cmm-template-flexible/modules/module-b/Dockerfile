FROM node:18-alpine AS builder

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# バックエンド依存関係のインストールとビルド
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY backend .
RUN pnpm build

# フロントエンド依存関係のインストールとビルド
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm build

# 実行イメージ
FROM node:18-alpine AS runner

WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate

# バックエンド本番依存関係のインストール
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# ビルド済みバックエンドのコピー
COPY --from=builder /app/backend/dist ./dist

# ビルド済みフロントエンドのコピー
COPY --from=builder /app/frontend/dist /app/frontend/dist

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["node", "dist/index.js"]

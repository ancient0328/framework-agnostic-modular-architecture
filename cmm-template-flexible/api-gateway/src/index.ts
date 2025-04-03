import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './utils/logger';
import { verifyToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 4000;

// ミドルウェア
app.use(helmet());
app.use(cors());
app.use(express.json());

// ログミドルウェア
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 認証サービスへのプロキシ（認証不要）
app.use('/auth', createProxyMiddleware({
  target: 'http://auth:4100',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/',
  },
}));

// 認証ミドルウェア（以降のルートには認証が必要）
app.use('/api', verifyToken);

// モジュールAへのプロキシ
app.use('/api/module-a', createProxyMiddleware({
  target: 'http://module-a:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/module-a': '/',
  },
}));

// モジュールBへのプロキシ
app.use('/api/module-b', createProxyMiddleware({
  target: 'http://module-b:5100',
  changeOrigin: true,
  pathRewrite: {
    '^/api/module-b': '/',
  },
}));

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'サーバーエラーが発生しました',
  });
});

// サーバー起動
app.listen(PORT, () => {
  logger.info(`APIゲートウェイがポート${PORT}で起動しました`);
});

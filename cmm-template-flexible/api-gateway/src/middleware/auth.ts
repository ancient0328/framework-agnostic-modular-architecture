import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// 環境変数からJWTシークレットを取得
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * JWTトークンを検証するミドルウェア
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '認証トークンがありません' });
    }

    // Bearer トークン形式を確認
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: '不正な認証形式です' });
    }

    const token = parts[1];

    // トークンを検証
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // リクエストオブジェクトにユーザー情報を追加
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    logger.error('認証エラー:', error);
    return res.status(401).json({ message: '無効な認証トークンです' });
  }
};

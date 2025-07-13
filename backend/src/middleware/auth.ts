import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

interface AuthRequest extends Request {
  userId?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('Auth middleware called.');
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Auth Middleware: Received token:', token ? token.substring(0, 30) + '...' : 'No token'); // Log first 30 chars

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  const jwtSecret = process.env.JWT_SECRET;
  console.log('Auth Middleware: JWT_SECRET from env (length):', jwtSecret ? jwtSecret.length : 'undefined');
  console.log('Auth Middleware: JWT_SECRET from env (first 10 chars):', jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'undefined');

  if (!jwtSecret) {
    console.error('Auth Middleware: JWT_SECRET is not defined!');
    return res.status(500).json({ message: 'Server configuration error: JWT secret not found.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret as string) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error('Auth Middleware: Token verification failed:', error.name, error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;

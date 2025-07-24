import express from 'express';
import { authWallet } from '../controllers/authController';

const router = express.Router();

router.post('/wallet', authWallet);

export default router;

import express from 'express';
import { placeBet } from '../controllers/betController'; // Assuming you have these controllers
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').post(protect, placeBet);

export default router;

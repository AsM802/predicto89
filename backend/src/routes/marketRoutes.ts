import express from 'express';
import { getMarkets, createMarket, getMarketById, resolveMarket } from '../controllers/marketController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getMarkets).post(protect, createMarket);
router.route('/:id').get(getMarketById);
router.route('/resolve').put(protect, resolveMarket);

export default router;
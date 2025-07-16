
import { Router } from 'express';
import { initializeMarket, resolveMarket } from '../ctfAdapter';

const router = Router();

router.post('/initialize', async (req, res) => {
    try {
        await initializeMarket(req.body);
        res.status(200).send('Market initialized');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/resolve/:marketId', async (req, res) => {
    try {
        await resolveMarket(req.params.marketId);
        res.status(200).send('Market resolved');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;

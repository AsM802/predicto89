
import { Router } from 'express';
import { initializeMarket, resolveMarket } from '../ctfAdapter';

const router = Router();

router.post('/initialize', async (req, res) => {
    try {
        await initializeMarket(req.body);
        res.status(200).send('Market initialized');
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

router.post('/resolve/:marketId', async (req, res) => {
    try {
        await resolveMarket(req.params.marketId);
        res.status(200).send('Market resolved');
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

export default router;

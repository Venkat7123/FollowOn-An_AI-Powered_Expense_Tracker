import express from 'express';
import { getSummary } from '../controllers/summaryControl.js';

const router = express.Router();

router.get('/:userId', getSummary);

export default router;
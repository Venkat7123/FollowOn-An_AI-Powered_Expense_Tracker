import express from 'express';

import { addExpense, getExpense, deleteExpense, updateExpense } from '../controllers/expenseControl.js';

const router = express.Router();

router.post('/addExpense', addExpense);
router.post('/getExpense', getExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.put('/updateExpense/:id', updateExpense);

export default router;
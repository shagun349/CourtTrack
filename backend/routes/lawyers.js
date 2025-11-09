
import express from 'express';
const router = express.Router();
import { getAllLawyers } from '../models/lawyer.js';

// GET /api/lawyers
router.get('/lawyers', async (req, res) => {
  try {
    const { search, minApprovalRate, minWins, minCases } = req.query;
    const filters = { minApprovalRate, minWins, minCases };
    const lawyers = await getAllLawyers(search, filters);
    res.json(lawyers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lawyers' });
  }
});

export default router;

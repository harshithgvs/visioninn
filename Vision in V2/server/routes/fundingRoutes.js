import express from 'express';
import { getFundingPrograms, submitPitch } from '../controllers/fundingController.js';

const router = express.Router();

router.get('/', getFundingPrograms);
router.post('/pitch', submitPitch);

export default router;

import express from 'express';
import { getJobs, createJob, applyJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', createJob);
router.post('/:id/apply', applyJob);

export default router;

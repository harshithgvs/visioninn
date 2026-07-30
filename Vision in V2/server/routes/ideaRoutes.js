import express from 'express';
import { getIdeas, createIdea, toggleIdeaVisibility, verifyIdeaTimestamp } from '../controllers/ideaController.js';

const router = express.Router();

router.get('/', getIdeas);
router.post('/', createIdea);
router.patch('/:id/visibility', toggleIdeaVisibility);
router.get('/:id/verify', verifyIdeaTimestamp);

export default router;

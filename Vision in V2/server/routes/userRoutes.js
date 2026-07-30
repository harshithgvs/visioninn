import express from 'express';
import { getUsers, getUserById, updateUserProfile, connectRequest } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', updateUserProfile);
router.post('/connect', connectRequest);

export default router;

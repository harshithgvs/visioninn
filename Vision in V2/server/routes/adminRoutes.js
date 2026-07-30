import express from 'express';
import { getAdminStats, updateUserRoleByAdmin, deleteUserByAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.patch('/users/:id/role', updateUserRoleByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

export default router;

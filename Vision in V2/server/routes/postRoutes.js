import express from 'express';
import { getPosts, createPost, toggleLikePost, addComment, toggleSavePost, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/like', toggleLikePost);
router.post('/:id/comment', addComment);
router.post('/:id/save', toggleSavePost);
router.delete('/:id', deletePost);

export default router;

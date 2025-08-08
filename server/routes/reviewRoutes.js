import express from 'express';
import {
  createReview,
  getReviewsByStyle
} from '../controllers/reviewController.js';
import { middlewareToProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📝 Direct review routes
router.post('/:id', middlewareToProtect, createReview);
router.get('/:id', getReviewsByStyle);

export default router;
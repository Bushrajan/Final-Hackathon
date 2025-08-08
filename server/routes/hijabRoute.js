import express from 'express';
import {
  createReview,
  getReviewsByStyle
} from '../controllers/reviewController.js';
import {middlewareToProtect} from '../middleware/authMiddleware.js';

const router = express.Router();

// 🧵 Nested review routes under hijab styles
router.post('/:id/reviews', middlewareToProtect, createReview);
router.get('/:id/reviews', getReviewsByStyle);

export default router;
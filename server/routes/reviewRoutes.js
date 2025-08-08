import express from 'express';
import {
  createReview,
  getReviewsByStyle,
  deleteReview,
  deleteAllReviews,
  updateReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Create review
router.post('/style/:styleId', createReview);

// Get all reviews for a style
router.get('/style/:styleId', getReviewsByStyle);

// Delete one review
router.delete('/:id', deleteReview);

// Delete all reviews for a style
router.delete('/style/:styleId', deleteAllReviews);

// Update review
router.put('/:id', updateReview);

export default router;
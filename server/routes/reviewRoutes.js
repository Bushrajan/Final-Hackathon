import express from 'express';
import {
    createReview,
    getReviewsByStyle,
    deleteReview,
    deleteAllReviews,
    updateReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/style/:styleId', createReview);
router.get('/style/:styleId', getReviewsByStyle);
router.put('/:id', updateReview);
router.delete('/style/:styleId', deleteAllReviews);
router.delete('/:id', deleteReview);


export default router;
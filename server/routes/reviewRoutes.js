import express from 'express';
import {
    createReview,
    getReviewsByStyle,
    deleteReview,
    deleteAllReviews,
    updateReview
} from '../controllers/reviewController.js';
import { middlewareToProtect } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/style/:styleId', middlewareToProtect, createReview);
router.get('/style/:styleId', middlewareToProtect, getReviewsByStyle);
router.put('/:id', middlewareToProtect, updateReview);
router.delete('/style/:styleId', middlewareToProtect, deleteAllReviews);
router.delete('/:id', middlewareToProtect, deleteReview);


export default router;
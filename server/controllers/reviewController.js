import Review from '../models/review.js';
import HijabStyle from '../models/style.js';

// ✍️ Create a review
export const createReview = async (req, res) => {
  const { rating, text } = req.body;
  const userId = req.user?.id || req.user?._id;
  const hijabStyleId = req.params.id;

  try {
    const style = await HijabStyle.findById(hijabStyleId);
    if (!style) return res.status(404).json({ message: 'Hijab style not found' });

    const existingReview = await Review.findOne({
      user: userId,
      hijabStyle: hijabStyleId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this style' });
    }

    const review = new Review({
      user: userId,
      hijabStyle: hijabStyleId,
      rating,
      text
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
};

// 🔍 Get all reviews for a style
export const getReviewsByStyle = async (req, res) => {
  try {
    const reviews = await Review.find({ hijabStyle: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};
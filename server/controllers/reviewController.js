import Review from '../models/review.js';
import HijabStyle from '../models/style.js';

// ✍️ Create a review
export const createReview = async (req, res) => {
  const { rating, text } = req.body;
  const userId = req.user?.id || req.user?._id;
  const hijabStyleId = req.params.styleId;

  if (!rating || rating < 1 || rating > 5 || !text?.trim()) {
    return res.status(400).json({ message: 'Invalid rating or empty comment' });
  }

  try {
    const style = await HijabStyle.findById(hijabStyleId);
    if (!style) return res.status(404).json({ message: 'Hijab style not found' });

    const existingReview = await Review.findOne({ user: userId, hijabStyle: hijabStyleId });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this style' });
    }

    const review = new Review({ user: userId, hijabStyle: hijabStyleId, rating, text });
    await review.save();

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ message: 'Error submitting review', error: err.message });
  }
};

// 🔍 Get all reviews for a style
export const getReviewsByStyle = async (req, res) => {
  const hijabStyleId = req.params.styleId;

  try {
    const reviews = await Review.find({ hijabStyle: hijabStyleId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

// 🗑️ Delete one review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};

// 🧹 Delete all reviews for a style
export const deleteAllReviews = async (req, res) => {
  const hijabStyleId = req.params.styleId;

  try {
    await Review.deleteMany({ hijabStyle: hijabStyleId });
    res.status(200).json({ message: 'All reviews deleted for this style' });
  } catch (err) {
    console.error('Delete all reviews error:', err);
    res.status(500).json({ message: 'Error deleting reviews', error: err.message });
  }
};

// ✏️ Update a review
export const updateReview = async (req, res) => {
  const { rating, text } = req.body;

  if (!rating || rating < 1 || rating > 5 || !text?.trim()) {
    return res.status(400).json({ message: 'Invalid rating or empty comment' });
  }

  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, text },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json({ message: 'Review updated', review: updated });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
};
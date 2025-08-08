import HijabStyle from '../models/HijabStyle.js';

// 🟢 Get all hijab styles
export const getAllStyles = async (req, res) => {
  try {
    const styles = await HijabStyle.find();
    res.status(200).json(styles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch styles', error: err.message });
  }
};

// 🔍 Get single style with reviews
export const getStyleById = async (req, res) => {
  try {
    const style = await HijabStyle.findById(req.params.id)
      .populate('reviews.user', 'name profileImage');
    if (!style) return res.status(404).json({ message: 'Style not found' });
    res.status(200).json(style);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching style', error: err.message });
  }
};

// ✍️ Add a review (auth required)
export const addReview = async (req, res) => {
  const { rating, text } = req.body;
  const userId = req.user._id;

  try {
    const style = await HijabStyle.findById(req.params.id);
    if (!style) return res.status(404).json({ message: 'Style not found' });

    // Check if user already reviewed
    const alreadyReviewed = style.reviews.find(
      r => r.user.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this style' });
    }

    // Add review
    style.reviews.push({ user: userId, rating, text });
    await style.save();

    res.status(201).json({ message: 'Review added successfully', style });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};
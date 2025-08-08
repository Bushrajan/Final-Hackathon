import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hijabStyle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HijabStyle'
  },
  rating: Number,
  text: String,
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
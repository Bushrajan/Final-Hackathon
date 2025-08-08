import { useState } from 'react';
import { apiAuthHandle } from '../config/apiAuthHandle';

const ReviewModal = ({ styleId, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiAuthHandle.post(`/${styleId}/reviews`, { rating, text });
    onReviewSubmitted();
    onClose();
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 shadow-lg z-50">
      <h3 className="text-lg font-bold mb-2">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-2 mb-2"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Your review..."
        />
        <select
          className="w-full border p-2 mb-2"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Submit</button>
        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </form>
    </div>
  );
};

export default ReviewModal;
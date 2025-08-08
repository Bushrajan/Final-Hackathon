import { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';
import { apiAuthHandle } from '../config/apiAuthHandle';

const HijabCard = ({ style }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data } = await apiAuthHandle.get(`/${style._id}/reviews`);
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Review fetch error:', err.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style._id]); // safer dependency

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="border p-4 rounded shadow">
      <img src={style.image} alt={style.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-xl font-bold mt-2">{style.name}</h3>
      <p className="text-gray-700">{style.description}</p>

      {loadingReviews ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="mt-1 text-sm">
          ⭐ {avgRating || 'No ratings yet'} ({reviews.length} reviews)
        </p>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Write Review
      </button>

      {showModal && (
        <ReviewModal
          styleId={style._id}
          onClose={() => setShowModal(false)}
          onReviewSubmitted={fetchReviews}
        />
      )}
    </div>
  );
};

export default HijabCard;
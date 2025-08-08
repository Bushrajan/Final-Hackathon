
import { useState, useEffect } from 'react';
import axios from 'axios';

const HijabCard = ({ style }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [formData, setFormData] = useState({ text: '', rating: 1 });
  const [newReview, setNewReview] = useState({ text: '', rating: 5 });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchReviews();
  }, [style._id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data } = await axios.get(
        `https://hackathonserver-production.up.railway.app/api/reviews/style/${style._id}`,
        config
      );
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleFavorite = () => {
    const oldFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    const alreadyAdded = oldFavs.some((fav) => fav._id === style._id);
    if (!alreadyAdded) {
      const updated = [...oldFavs, style];
      localStorage.setItem("favorites", JSON.stringify(updated));
      alert("Added to favorites 💗");
    } else {
      alert("Already in favorites!");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`https://hackathonserver-production.up.railway.app/api/reviews/${reviewId}`, config);
      fetchReviews();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setFormData({ text: review.text, rating: review.rating });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://hackathonserver-production.up.railway.app/api/reviews/${editReview._id}`,
        formData,
        config
      );
      setEditModal(false);
      setEditReview(null);
      fetchReviews();
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://hackathonserver-production.up.railway.app/api/reviews/style/${style._id}`,
        newReview,
        config
      );
      setShowModal(false);
      setNewReview({ text: '', rating: 5 });
      fetchReviews();
    } catch (err) {
      console.error('Review submission failed:', err.message);
    }
  };

  return (
    <div className="border w-[300px] h-[640px] p-4 bg-gray-900 rounded-lg shadow text-white">
      <img
        src={style.profileImage}
        alt={style.name}
        className="w-full h-60 object-cover rounded mb-3"
      />
      <h3 className="text-xl font-bold">Name: {style.name}</h3>
      <p className="text-sm mb-2">Description: {style.description}</p>

      {loadingReviews ? (
        <p className="text-gray-400 text-sm">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <>
          <p className="text-sm mt-2">
            ⭐ {avgRating || 'No ratings yet'} ({reviews.length} reviews)
          </p>

          <div className="mt-2 space-y-3 max-h-[220px] overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-800 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  {review.user?.profileImage && (
                    <img
                      src={review.user.profileImage}
                      alt={review.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{review.user?.name}</p>
                    <p className="text-xs text-gray-400">{review.user?.email}</p>
                  </div>
                </div>
                <p className="text-sm">
                  <strong>Review:</strong> {review.text}
                </p>
                <p className="text-sm">
                  <strong>Rating:</strong> {review.rating} ✨
                </p>
                <div className="flex gap-2 mt-2 text-sm">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-400 hover:underline"
                  >
                    📝 Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-400 hover:underline"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Write Review
            </button>
            <button
              onClick={handleFavorite}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
            >
              💗 Add to Favorites
            </button>
          </div>
        </>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full border rounded p-2 mb-2"
                rows={3}
                placeholder="Your review..."
              />
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
                className="w-full border rounded p-2 mb-2"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Review</h3>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full border rounded p-2 mb-2"
              rows={3}
            />
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full border rounded p-2 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HijabCard;

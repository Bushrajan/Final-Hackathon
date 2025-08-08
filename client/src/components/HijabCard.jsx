// import { useState, useEffect } from 'react';
// import ReviewModal from './ReviewModal'; 
// import axios from 'axios';

// const HijabCard = ({ style }) => {
//   const [reviews, setReviews] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loadingReviews, setLoadingReviews] = useState(true);
//   const [error, setError] = useState('');

//   const fetchReviews = async () => {
//     try {
//       setLoadingReviews(true);
//       // const { data } = await axios.get(`http://localhost:2525/api/reviews/style/${style._id}`);
//       const data = await axios.get(`http://localhost:2525/api/hijab/reviews/style/${style._id}`);
// ;
//       setReviews(data);
//     } catch (err) {
//       setError('Failed to load reviews');
//       console.error('Review fetch error:', err.message);
//     } finally {
//       setLoadingReviews(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [style._id]); // safer dependency

//   const avgRating = reviews.length
//     ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//     : null;

//   return (
//     <div className="border p-4 rounded shadow">
//       <img src={style.image} alt={style.name} className="w-full h-48 object-cover rounded" />
//       <h3 className="text-xl font-bold mt-2">{style.name}</h3>
//       <p className="text-gray-700">{style.description}</p>

//       {loadingReviews ? (
//         <p className="text-sm text-gray-500">Loading reviews...</p>
//       ) : error ? (
//         <p className="text-sm text-red-500">{error}</p>
//       ) : (
//         <p className="mt-1 text-sm">
//           ⭐ {avgRating || 'No ratings yet'} ({reviews.length} reviews)
//         </p>
//       )}

//       <button
//         onClick={() => setShowModal(true)}
//         className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Write Review
//       </button>

//       {showModal && (
//         <ReviewModal
//           styleId={style._id}
//           onClose={() => setShowModal(false)}
//           onReviewSubmitted={fetchReviews}
//         />
//       )}
//     </div>
//   );
// };

// export default HijabCard;

import { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';
import axios from 'axios';

const HijabCard = ({ style }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [formData, setFormData] = useState({ text: '', rating: 1 });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data } = await axios.get(`http://localhost:2525/api/reviews/style/${style._id}`);
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
  }, [style._id]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:2525/api/reviews/${reviewId}`);
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
      await axios.put(`http://localhost:2525/api/reviews/${editReview._id}`, formData);
      setEditModal(false);
      setEditReview(null);
      fetchReviews();
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

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
        <>
          <p className="mt-1 text-sm">
            ⭐ {avgRating || 'No ratings yet'} ({reviews.length} reviews)
          </p>
          <div className="mt-2 space-y-2">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-100 p-2 rounded">
                <p className="text-sm">{review.text}</p>
                <p className="text-xs text-gray-500">Rating: {review.rating}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
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
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
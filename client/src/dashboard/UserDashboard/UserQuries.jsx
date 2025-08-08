import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiQueryHandle from '../../config/apiQueryHandle';
import { FaEdit, FaTrash, FaFacebook, FaLinkedin, FaHeart } from 'react-icons/fa';

const UserQuires = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', isPublic: true });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Favorite questions state (for UI highlight)
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  });

  // Like counts state (persisted in localStorage)
  const [likeCounts, setLikeCounts] = useState(() => {
    const likes = localStorage.getItem('likeCounts');
    return likes ? JSON.parse(likes) : {};
  });

  // Add to favorites and increment like count only if not already liked
  const toggleFavorite = (question) => {
    let favs = [...favorites];
    const exists = favs.find((q) => q._id === question._id);
    if (exists) {
      toast.info('You have already liked this question.');
      return;
    } else {
      // Save the full card (with answer, etc.)
      favs.push({ ...question });
      setFavorites(favs);
      localStorage.setItem('favorites', JSON.stringify(favs));
      setLikeCounts((prev) => {
        const newCounts = { ...prev };
        newCounts[question._id] = (newCounts[question._id] || 0) + 1;
        localStorage.setItem('likeCounts', JSON.stringify(newCounts));
        return newCounts;
      });
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await apiQueryHandle.get('/getMy', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setQuestions(data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await apiQueryHandle.delete(`/delete/${questionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Question deleted');
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
      await fetchQuestions();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({ title: '', description: '', isPublic: true });
    setShowModal(true);
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      description: question.description,
      isPublic: question.isPublic,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      if (editingQuestion) {
        await apiQueryHandle.put(`/update/${editingQuestion._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Question updated successfully');
      } else {
        await apiQueryHandle.post('/add', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Question added successfully');
      }
      setShowModal(false);
      setEditingQuestion(null);
      setFormData({ title: '', description: '', isPublic: true });
      await fetchQuestions();
    } catch (err) {
      toast.error(editingQuestion ? 'Update failed' : 'Add failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="text-white rounded-lg shadow p-6">
      {userInfo && (
        <div className="mb-6 flex items-center gap-4">
          <img src={userInfo.dp || '/user.avif'} alt="User" className="w-16 h-16 rounded-full border-2 border-green-500 object-cover" />
          <div>
            <h3 className="text-lg font-bold text-white">{userInfo.name}</h3>
            <p className="text-sm text-white">{userInfo.email}</p>
            <div className="flex gap-3 mt-1">
              {userInfo.socialLinks?.facebook && (
                <a href={userInfo.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-yellow-100 hover:text-blue-100">
                  <FaFacebook /> Facebook
                </a>
              )}
              {userInfo.socialLinks?.linkedin && (
                <a href={userInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-yellow-100 hover:text-blue-100">
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-500">My Queries</h2>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Ask Query?</button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-white">No questions found.</p>
      ) : (
        <div className="flex flex-wrap gap-6 ">
          {questions.map((q) => {
            const isFav = favorites.some((f) => f._id === q._id);
            const likeCount = likeCounts[q._id] || 0;
            return (
              <div key={q._id} className=" border p-2 bg-white card text-black rounded shadow">
                <h3 className="text-lg font-semibold"><strong>📝 Title:</strong> {q.title}</h3>
                <p className="text-sm"><strong>🗒️ Description:</strong> {q.description}</p>
                <div className="mt-2 bg-gray-200 p-1 pb-4">
                  {q.answer?.answerText ? (
                    <>
                      <div className="text-green-500  mt-6 font-bold">🤷‍♂️🤦‍♂️ Answer By Admin:</div>
                      <p className="text-sm text-yellow-700 mt-1">{q.answer.answerText}</p>
                      <span className="text-green-700 font-semibold block mt-1">Status: Complete</span>
                    </>
                  ) : (
                    <span className="text-yellow-700 font-semibold">Status: Pending</span>
                  )}
                </div>
                <div className="mt-3 flex flex-row justify-end gap-4">
                  <button
                    className={isFav ? "text-pink-500 flex" : "flex text-red-500"}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    onClick={() => toggleFavorite(q)}
                  >
                    <FaHeart />
                    <p className="ml-1 text-xs align-middle">{likeCount > 0 ? likeCount : ''}</p>
                  </button>
                  <button onClick={() => openEditModal(q)} className="text-yellow-500"><FaEdit /></button>
                  <button onClick={() => confirmDelete(q._id)} className="text-red-600"><FaTrash /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button onClick={() => { setShowModal(false); setEditingQuestion(null); }} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingQuestion ? 'Edit Question' : 'Ask a New Question'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1 w-full p-2 border rounded text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="mt-1 w-full p-2 border rounded text-black" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} className="mr-2" />
                <label className="text-sm text-gray-700 dark:text-gray-300">Make Public</label>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  {loading ? 'Submitting...' : editingQuestion ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete this question?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setDeleteModalOpen(false); setQuestionToDelete(null); }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQuires;

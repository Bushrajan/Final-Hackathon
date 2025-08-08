import React, { useEffect, useState } from 'react';

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Get favorites from localStorage
    const favs = localStorage.getItem('favorites');
    if (favs) {
      try {
        setFavorites(JSON.parse(favs));
      } catch {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, []);

  return (
    <div className=" rounded-lg shadow p-6">
      <h2 className="text-xl text-white font-bold mb-4">💗Favorite Blocks</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav._id} className="border rounded p-4 bg-white shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{fav.title}</h3>
              <p className="text-sm text-gray-700 mb-2">{fav.description}</p>
              {fav.answer && fav.answer.answerText && (
                <div className="mb-2">
                  <span className="text-green-700 font-semibold">Answer By ADMIN:</span>
                  <p className="text-sm text-gray-800 mt-1">{fav.answer.answerText}</p>
                </div>
              )}
            {/* Status */}
            <div className="mt-2">
              {fav.answer && fav.answer.answerText ? (
                <span className="text-green-700 font-semibold">Status: Complete</span>
              ) : (
                <span className="text-yellow-700 font-semibold">Status: Pending</span>
              )}
            </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">{fav.user?.name || fav.userId?.name || 'Unknown User'}</span>
                <span className="text-xs text-gray-400">{fav.user?.email || fav.userId?.email || ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;

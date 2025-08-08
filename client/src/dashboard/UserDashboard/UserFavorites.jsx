import { useEffect, useState } from 'react';

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">💗 Favorite Hijab Styles</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={fav.profileImage}
                alt={fav.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Name: {fav.name}</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Description: {fav.description}
                </p>

                {fav.rating && (
                  <p className="text-sm mb-2">⭐ Rating: {fav.rating}</p>
                )}

                {/* Optional: answer section */}
                {fav.answer && fav.answer.answerText && (
                  <div className="mt-2 bg-green-100 p-2 rounded text-green-800">
                    <strong>Answer by ADMIN:</strong>
                    <p className="text-sm mt-1 text-black">{fav.answer.answerText}</p>
                  </div>
                )}

                
                 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;

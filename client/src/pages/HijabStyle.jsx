import { useEffect, useState } from 'react';
import HijabCard from '../components/HijabCard'; 
import axios from 'axios';

const HijabStyle = () => {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const { data } = await axios.get('https://hackathonserver-production.up.railway.app/api/hijab'); // ✅ Correct route
        setStyles(data);
      } catch (err) {
        setError('Failed to load hijab styles');
        console.error('Hijab styles fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading hijab styles...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!styles.length) {
    return <div className="p-4 text-center mt-5 text-gray-500">No hijab styles found.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 justify-center items-center ">
      {styles.map(style => (
        <HijabCard key={style._id} style={style} />
      ))}
    </div>
  );
};

export default HijabStyle;
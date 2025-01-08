import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';

const Hotels = () => {
  const [hotels, setHotels] = useState(null); // Default to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/hotels');
        if (!response.ok) {
          throw new Error('Failed to fetch hotel data');
        }
        const data = await response.json();
        setHotels(data); // Ensure this is an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <div>Loading hotels...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <CardGrid hotels={hotels || []} /> {/* Pass an empty array if hotels is null */}
    </main>
  );
};

export default Hotels;

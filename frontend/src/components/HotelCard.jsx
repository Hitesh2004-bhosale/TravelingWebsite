// src/components/HotelCard.jsx
import React from 'react';

const HotelCard = () => {
  const hotel = {
    name: 'Mountain Retreat',
    location: 'Denver, USA',
    description: 'A serene getaway in the heart of the mountains.',
    image: 'https://im.whatshot.in/img/2019/Nov/the-o-hotel-1574330409.jpg',
  };

  return (
    <div className="card mb-4">
      {/* Hotel Image */}
      <img
        src={hotel.image}
        alt={hotel.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      
      <div className="card-body">
        {/* Hotel Name and Location */}
        <h5 className="card-title">{hotel.name}</h5>
        <p className="card-text text-muted">{hotel.location}</p>
        
        {/* Hotel Description */}
        <p className="card-text">{hotel.description}</p>
      </div>
    </div>
  );
};

export default HotelCard;

import React, { useState } from 'react';
import './CardGrid.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const CardGrid = ({ hotels = [] }) => {

  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openFullscreenImage = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };
const navigate = useNavigate();
const handleComment = (hotelid) => {
    
    navigate(`/hotelcomment/${hotelid}`); // Navigate to the second component with ID in the URL
  };

  const handleBooking = (hotelid) => {
    
    navigate(`/hotelbooking/${hotelid}`); // Navigate to the second component with ID in the URL
  };


  return (
    <div className="card-grid">
      {hotels.map((hotel) => (
        <div className="card" key={hotel.id}>
          <div
            className="card-image"
            onClick={() => openFullscreenImage(hotel.image)}
          >
            <img src={hotel.image} alt={hotel.name} />
          </div>
          <div className="card-content">
            <p>{hotel.name}</p>
            <p className="location">Location: {hotel.location}</p>
            <p className="description">{hotel.description}</p>
            <p className="rent">${hotel.price}/day</p>

          </div>
          <div className="split-button">
            <button onClick={() => handleComment(hotel._id)} className="left-button">
              Comments
            </button> <br /><br /> <br />
            <button onClick={() => handleBooking(hotel._id)} className="right-button">
              Booking
            </button>
          </div>

        </div>
      ))}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={closeFullscreenImage}>
          <div className="fullscreen-image-container">
            <img src={fullscreenImage} alt="Fullscreen View" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;

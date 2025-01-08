// src/components/ShowHotels.jsx
import React, { useState } from 'react';
import CommentCard from './CommentCard';
import Booking from './Booking';
import { useParams } from "react-router-dom";


const HotelComment = () => {
 
  const { id } = useParams(); // Retrieve the ID from the URL

  return (
<>
      <CommentCard hotelId={id} />
</>
    
  );
};

export default HotelComment;




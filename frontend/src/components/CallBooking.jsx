// src/components/ShowHotels.jsx
import React, { useState } from 'react';
import CommentCard from './CommentCard';
import Booking from './Booking';
import { useParams } from "react-router-dom";


const CallBooking = () => {
 
  const { id } = useParams(); // Retrieve the ID from the URL

  return (
<>
      <Booking hotelId={id}  />
      
</>
    
  );
};

export default CallBooking;




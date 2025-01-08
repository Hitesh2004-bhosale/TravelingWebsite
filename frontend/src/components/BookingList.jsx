import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingList.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch the bookings data from the backend API
    axios
      .get('http://localhost:5000/api/bookings') // Replace with your backend URL
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return 'Invalid Date';
    }
    return parsedDate.toLocaleDateString();
  };

  return (
    <div className="booking-list-container">
      <h1 className="table-header">Booking List</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>Location</th>
            <th>Booking Start Date</th>
            <th>Booking End Date</th>
            <th>Mobile Number</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.hotel?.name || 'N/A'}</td>
                <td>{booking.hotel?.location || 'N/A'}</td>
                <td>{formatDate(booking.startDate)}</td>
                <td>{formatDate(booking.endDate)}</td>
                <td>{booking.mobile || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No bookings available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;

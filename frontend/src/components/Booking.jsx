import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css';  // Make sure the CSS file is properly linked

const Booking = ({ hotelId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [scannedImage, setScannedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You may want to upload this image to a server and get the URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannedImage(reader.result); // Store base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const bookingData = {
      startDate,
      endDate,
      mobileNumber,
      numberOfPersons,
      scannedImage
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/book-hotel/${hotelId}`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Booking failed, please try again');
      setMessageType('error');
    }
  };

  return (
    <div className="booking-container">
      <h2>Hotel Booking</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
        </div>
        <div>
          <label>Number of Persons:</label>
          <input type="number" value={numberOfPersons} onChange={(e) => setNumberOfPersons(e.target.value)} min="1" required />
        </div>
        <div>
          <label>Upload Scanned Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Book Now</button>
      </form>
      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default Booking;

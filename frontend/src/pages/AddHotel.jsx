import React, { useState } from 'react';
import axios from 'axios';

const AddHotel = () => {
  const [formData, setFormData] = useState({ image: '', name: '', location: '', price: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/add-hotel', formData);
    alert('Hotel added successfully');
  };

  return (
    <form onSubmit={handleSubmit} className="w-50 mx-auto">
      <h2>Add Hotel</h2>
      <div className="mb-3">
        <label>Image URL</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Hotel Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Location</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Price per Day</label>
        <input
          type="number"
          className="form-control"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Hotel Description</label>
        <textarea
          className="form-control"
          rows="4"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
      </div>
      <button className="btn btn-primary">Add Hotel</button>
    </form>
  );
};

export default AddHotel;

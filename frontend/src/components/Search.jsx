import React, { useState } from "react";
import axios from "axios";
import "./Search.css";
import CommentCard from "./CommentCard";
import CardGrid from "./CardGrid";

import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Booking from "./Booking";
const Search = () => {
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!location && !name) {
      setError("Please provide at least one search criterion (Location or Name).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: { location, name },
      });

      setResults(response.data);
    } catch (err) {
      setError("An error occurred while searching.");
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
<>
    <div>
      <h2>Search Hotels</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* <div>
      
        {results.length > 0 ? (
          <ul>
            {results.map((hotel, index) => (
              <li key={index}>
                <img src={hotel.image} className="card-img-top" alt={hotel.name} />
                <p><strong>Name:</strong> {hotel.name}</p>
                <p><strong>Location:</strong> {hotel.location}</p>
                <p><strong>Price:</strong> ${hotel.price}</p>
                <p><strong>Description:</strong> {hotel.description}</p>
                
                
                <CommentCard hotelId={hotel._id} />
                <Booking hotelId={hotel._id}  />
                     <CardGrid hotels={hotels || []} /> 
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
          
        )}
      </div> */}
       <CardGrid hotels={results || []} /> 
    </div>

</>
  );
};

export default Search;

import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import ReactStars from 'react-rating-stars-component'; // Rating component
import axios from 'axios';
import "./CommentCard.css"


const CommentCard = ({ hotelId }) => {

 





  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commenting, setCommenting] = useState(false);
  const [rating, setRating] = useState(0);

  // Fetch comments from the backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/hotel/${hotelId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };

    fetchComments();
  }, [hotelId]); // Re-fetch comments when hotelId changes

  // Handle comment input change
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Handle comment submit
  const handleCommentSubmit = async () => {
    if (comment.trim() && rating > 0) {
      setCommenting(true);
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const newComment = { text: comment, rating };

        // Send the comment to the backend
        await axios.post(
          `http://localhost:5000/hotel/${hotelId}/comments`,
          newComment,
          { headers: { Authorization: `Bearer ${token}` } } // Add Authorization header
        );

        // Add the new comment to the list and reset input fields
        setComments([newComment, ...comments]);
        setComment('');
        setRating(0);
      } catch (error) {
        console.error('Error posting comment', error);
      } finally {
        setCommenting(false);
      }
    }
  };

  return (
    <div className="comment-card">
      {/* Comment Input */}
      <div className="d-flex align-items-center justify-content-center">
        <FaUserCircle size={40} className="me-3" />
        <textarea
          value={comment}
          onChange={handleCommentChange}
          className="form-control comment-input"
          placeholder="Add a comment..."
          rows="2"
        />
      {/* Rating Input */}
      <div className="mt-2">
        <ReactStars
          count={5}
          value={rating}
          onChange={handleRatingChange}
          size={24}
          activeColor="#ffd700"
        />
      </div>
        <button
          className="btn btn-primary ms-2"
          onClick={handleCommentSubmit}
          disabled={commenting || !comment.trim() || rating === 0}
        >
          {commenting ? 'Posting...' : 'Post'}
        </button>
      </div>



      {/* Comment List */}
      <div className="comments mt-3">
        {comments.map((comment, index) => (
          <div className="d-flex align-items-start mb-3" key={index}>
            <FaUserCircle size={40} className="me-3" />
            <div>
              <strong>{comment.userId ? comment.userId.username : 'Anonymous'}</strong>
              <p className="mb-0">{comment.text}</p>
              <ReactStars
                count={5}
                value={comment.rating}
                size={20}
                edit={false}
                activeColor="#ffd700"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentCard;

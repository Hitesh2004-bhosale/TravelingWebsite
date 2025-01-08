import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon for comment section
import ReactStars from 'react-rating-stars-component'; // Rating component

const CommentCard = () => {
  const [comment, setComment] = useState(''); // Holds the comment input
  const [comments, setComments] = useState([]); // Holds the list of comments fetched from backend
  const [commenting, setCommenting] = useState(false); // To manage the UI state for the comment submission
  const [rating, setRating] = useState(0); // Holds the rating value
  const [error, setError] = useState(''); // Holds error messages, if any

  // Fetch comments from the backend on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/comments'); // Replace with your backend endpoint
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError('Failed to load comments. Please try again.');
        console.error(err);
      }
    };

    fetchComments();
  }, []);

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
      setError(''); // Clear previous errors
      try {
        const response = await fetch('http://localhost:5000/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: 'John Doe', text: comment, rating }), // Replace 'John Doe' with dynamic username if available
        });

        if (!response.ok) throw new Error('Failed to post comment');
        const newComment = await response.json();
        setComments([newComment, ...comments]); // Add new comment to the top of the list
        setComment(''); // Clear the input field
        setRating(0); // Reset the rating
      } catch (err) {
        setError('Failed to post comment. Please try again.');
        console.error(err);
      } finally {
        setCommenting(false); // Stop the loading spinner
      }
    }
  };

  return (
    <div className="comment-card">
      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

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
        <button
          className="btn btn-primary ms-2"
          onClick={handleCommentSubmit}
          disabled={commenting || !comment.trim() || rating === 0}
        >
          {commenting ? 'Posting...' : 'Post'}
        </button>
      </div>

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

      {/* Comment List */}
      <div className="comments mt-3">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div className="d-flex align-items-start mb-3" key={index}>
              <FaUserCircle size={40} className="me-3" />
              <div>
                <strong>{comment.user}</strong>
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
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentCard;

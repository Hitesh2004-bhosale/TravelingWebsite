import React, { useState } from 'react';
import "./SignIn.css";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User registered successfully!');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage('Error: Unable to reach the server.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="signInUsername" className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="signInUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="signInEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-sm"
              id="signInEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="signInPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-sm"
              id="signInPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary btn-sm">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

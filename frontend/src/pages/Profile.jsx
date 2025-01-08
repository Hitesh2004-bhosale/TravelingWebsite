import React, { useEffect, useState } from "react";
import axios from "axios";
import './Profile.css';  // Import the CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login"; // Redirect to login if token is not found
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to load profile");
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New password and confirmation do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Redirect to login if token is not found
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordChangeMessage(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordChangeMessage(err.response?.data?.message || "Error changing password");
      console.error("Password change failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-card">


      <div className="profile-body">
        <div className="profile-image-container">
          <img
            src="https://pic.onlinewebfonts.com/thumbnails/icons_542942.svg"
            alt="Profile"
            className="profile-image"
          />
        </div>
        {user ? (
          <div className="profile-info">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>No user data found</p>
        )}
      </div>

      <hr />

      <div className="password-change">
        <h3>Change Password</h3>
        {passwordChangeMessage && <p className="error-message">{passwordChangeMessage}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="label">Current Password: </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">New Password: </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Confirm New Password: </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button className="button" type="submit">Change Password</button>
        </form>
      </div>


    </div>
  );
};

export default Profile;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If user is not logged in
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Please Login</h1>

          <p>
            You need to login to view your profile.
          </p>

          <button onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/");
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-icon">
            👤
          </div>

          <h1>My Profile</h1>

          <p>Welcome back, {user.name}!</p>
        </div>

        <div className="profile-details">

          <div className="profile-detail">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-detail">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          {user.phone && (
            <div className="profile-detail">
              <span>Phone</span>
              <strong>{user.phone}</strong>
            </div>
          )}

          {user.role && (
            <div className="profile-detail">
              <span>Account Type</span>
              <strong>
                {user.role === "admin" ? "Admin" : "User"}
              </strong>
            </div>
          )}

        </div>

        <div className="profile-actions">

          <button
            className="orders-btn"
            onClick={() => navigate("/orders")}
          >
            📦 My Orders
          </button>

          <button
            className="logout-profile-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;
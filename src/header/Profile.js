import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSave, FaLock } from "react-icons/fa";
import "../css/Profile.css";

const Profile = () => {
  // Sample User Data
  const initialUserData = {
    username: "admin",
    role: "Super Admin",
    email: "admin@example.com",
    mobile: "123-456-7890",
    locationId: "L001",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    alert("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setPasswordModalOpen(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h2>{userData.username}</h2>
          <p className="user-role">{userData.role}</p>
        </div>

        <div className="profile-details">
          <div className="profile-info">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>

          <div className="profile-info">
            <label>Mobile:</label>
            {isEditing ? (
              <input
                type="text"
                value={userData.mobile}
                onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
              />
            ) : (
              <p>{userData.mobile}</p>
            )}
          </div>

          <div className="profile-info">
            <label>Location ID:</label>
            <p>{userData.locationId}</p>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              <FaSave /> Save
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEditToggle}>
              <FaEdit /> Edit
            </button>
          )}
          <button className="change-password-btn" onClick={() => setPasswordModalOpen(true)}>
            <FaLock /> Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button onClick={handleChangePassword} className="save-btn">Save</button>
              <button onClick={() => setPasswordModalOpen(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

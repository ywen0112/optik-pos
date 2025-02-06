import React, { useState } from "react";
import Select from "react-select";
import { FaRegUserCircle, FaRegEdit, FaRegSave, FaUnlockAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/Profile.css";

const roleOptions = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const locationOptions = [
  { value: "L001", label: "L001" },
  { value: "L002", label: "L002" },
  { value: "L003", label: "L003" },
];

const Profile = () => {
  const initialUserData = {
    username: "admin",
    role: { value: "super-admin", label: "Super Admin" },
    email: "admin@example.com",
    mobile: "123-456-7890",
    locationId: { value: "L001", label: "L001" },
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

  const handleLogout = () => {
    alert("You have logged out.");
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
    <div className="profile-card">
      <div className="profile-header">
        <FaRegUserCircle className="profile-icon" />
      </div>

      <div className="profile-details">
      <div className="profile-info">
          <label>Username:</label>
          {isEditing ? (
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          ) : (
            <p>{userData.username}</p>
          )}
        </div>
        <div className="profile-info">
          <label>User Role:</label>
          {isEditing ? (
            <Select
              className="profile-select"
              classNamePrefix="react-select"
              value={userData.role}
              onChange={(selectedOption) => setUserData({ ...userData, role: selectedOption })}
              options={roleOptions}
              isSearchable
            />
          ) : (
            <p>{userData.role.label}</p>
          )}
        </div>

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
          {isEditing ? (
            <Select
              className="profile-select"
              classNamePrefix="react-select"
              value={userData.locationId}
              onChange={(selectedOption) => setUserData({ ...userData, locationId: selectedOption })}
              options={locationOptions}
              isSearchable
            />
          ) : (
            <p>{userData.locationId.label}</p>
          )}
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            <FaRegSave /> Save
          </button>
        ) : (
          <button className="edit-btn" onClick={handleEditToggle}>
            <FaRegEdit /> Edit
          </button>
        )}
        <button className="change-password-btn" onClick={() => setPasswordModalOpen(true)}>
          <FaUnlockAlt /> Change Password
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

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

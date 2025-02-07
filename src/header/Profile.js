import React, { useState } from "react";
import Select from "react-select";
import { FaRegUserCircle, FaRegEdit, FaRegSave, FaUnlockAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/Profile.css";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import SuccessModal from "../modals/SuccessModal";

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
  const [errors, setErrors] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const validateFields = () => {
    const validationErrors = {};
    if (!userData.username.trim()) validationErrors.username = "Username is required.";
    if (!userData.role) validationErrors.role = "User Role is required.";
    if (!userData.email.trim()) {
      validationErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        validationErrors.email = "Invalid email format.";
      }
    }
    if (!userData.mobile.trim()) validationErrors.mobile = "Mobile number is required.";
    if (!userData.locationId) validationErrors.locationId = "Location ID is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      setIsConfirmOpen(true);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };

  const handleConfirmation = () => {
    setIsEditing(false);
    setIsConfirmOpen(false);
    setSuccessModal({ isOpen: true, title: "Update Successfully!" });
  };

  const handleLogout = () => {
    alert("You have logged out.");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }
    alert("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
    setErrors("");
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
          <div className="profile-info-input">
            {isEditing ? (
              <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                className={errors.username ? "input-error" : ""}
              />
            ) : (
              <p>{userData.username}</p>
            )}
          </div>
        </div>
        {errors.username && <p className="error-message">{errors.username}</p>}

        <div className="profile-info">
          <label>User Role:</label>
          <div className="profile-info-input">
            {isEditing ? (
              <Select
                className={`profile-select ${errors.role ? "input-error" : ""}`}
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
        </div>
        {errors.role && <p className="error-message">{errors.role}</p>}

        <div className="profile-info">
          <label>Email:</label>
          <div className="profile-info-input">
            {isEditing ? (
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className={errors.email ? "input-error" : ""}
              />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>
        </div>
        {errors.email && <p className="error-message">{errors.email}</p>}

        <div className="profile-info">
          <label>Mobile:</label>
          <div className="profile-info-input">
            {isEditing ? (
              <input
                type="text"
                value={userData.mobile}
                onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
                className={errors.mobile ? "input-error" : ""}
              />
            ) : (
              <p>{userData.mobile}</p>
            )}
          </div>
        </div>
        {errors.mobile && <p className="error-message">{errors.mobile}</p>}

        <div className="profile-info">
          <label>Location ID:</label>
          <div className="profile-info-input">
            {isEditing ? (
              <Select
                className={`profile-select ${errors.locationId ? "input-error" : ""}`}
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
        {errors.locationId && <p className="error-message">{errors.locationId}</p>}
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
            {errors && <p className="error-message">{errors}</p>}
            <div className="modal-actions">
              <button onClick={handleChangePassword} className="save-btn">Save</button>
              <button onClick={() => setPasswordModalOpen(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

    <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, title: ""})}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Update"
        message="Are you sure you want to save changes?"
        onConfirm={handleConfirmation}
        onCancel={() => setIsConfirmOpen(false)}
      />

    </div>
  );
};

export default Profile;

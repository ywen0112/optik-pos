import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "" });
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false); 
  const navigate = useNavigate();

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
      setIsConfirmSaveOpen(true);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };

  const handleConfirmationSave = () => {
    setIsEditing(false);
    setIsConfirmSaveOpen(false);
    setSuccessModal({ isOpen: true, title: "Update Successfully!" });
  };

  const handleLogout = () => {
    setIsConfirmLogoutOpen(true); 
  };

  const handleConfirmLogout = () => {
    setIsConfirmLogoutOpen(false);
    navigate("/login"); 
  };

  const handleChangePassword = () => {
    const validationErrors = {};

    if (!oldPassword.trim()) validationErrors.oldPassword = "Old password is required.";
    if (!newPassword.trim()) validationErrors.newPassword = "New password is required.";
    if (newPassword.length < 6) validationErrors.newPassword = "New password must be at least 6 characters long.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsConfirmPasswordOpen(true);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill out all required fields correctly.",
      });
    }
  };

  const handleConfirmPasswordChange = () => {
    setOldPassword("");
    setNewPassword("");
    setErrors({});
    setIsConfirmPasswordOpen(false);
    setPasswordModalOpen(false);
    setSuccessModal({ isOpen: true, title: "Password Changed Successfully!" });
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
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={errors.oldPassword ? "input-error" : ""}
              />
              {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}

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
        isOpen={isConfirmSaveOpen}
        title="Confirm Update"
        message="Are you sure you want to save changes?"
        onConfirm={handleConfirmationSave}
        onCancel={() => setIsConfirmSaveOpen(false)}
      />
      <ConfirmationModal
        isOpen={isConfirmPasswordOpen}
        title="Confirm Password Change"
        message="Are you sure you want to change password?"
        onConfirm={handleConfirmPasswordChange}
        onCancel={() => setIsConfirmPasswordOpen(false)}
      />
      <ConfirmationModal
        isOpen={isConfirmLogoutOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsConfirmLogoutOpen(false)}
      />

    </div>
  );
};

export default Profile;

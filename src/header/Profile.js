import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaRegUserCircle, FaRegEdit, FaRegSave, FaUnlockAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/Profile.css";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import SuccessModal from "../modals/SuccessModal";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    locationId: "",
  });
  const [roleOptions, setRoleOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "" });
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);

  const navigate = useNavigate();

  const customerId = Number(localStorage.getItem("customerId"));
  const userId = localStorage.getItem("userId");

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchUserData();
    fetchRoles();
    fetchLocations();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/GetSpecificUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, userId, id: userId }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        const user = data.data;

        const [rolesResponse, locationsResponse] = await Promise.all([
          fetch("https://optikposbackend.absplt.com/AccessRight/GetRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, keyword: "", offset: 0, limit: 9999 }),
          }),
          fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, keyword: "", offset: 0, limit: 9999 }),
          }),
        ]);

        const rolesData = await rolesResponse.json();
        const locationsData = await locationsResponse.json();

        if (!rolesResponse.ok || !rolesData.success) throw new Error("Failed to fetch roles.");
        if (!locationsResponse.ok || !locationsData.success) throw new Error("Failed to fetch locations.");

        const role = rolesData.data.find(role => role.accessRightId === user.accessRightId);
        const location = locationsData.data.find(loc => loc.locationId === user.locationId);

        setRoleOptions(rolesData.data.map(role => ({ value: role.accessRightId, label: role.description })));
        setLocationOptions(locationsData.data.map(loc => ({ value: loc.locationId, label: loc.locationCode })));

        setUserData({
          username: user.userName,
          email: user.userEmail,
          role: role ? { value: role.accessRightId, label: role.description } : null,
          location: location ? { value: location.locationId, label: location.locationCode } : null,
        });
      } else {
        throw new Error(data.errorMessage || "Failed to fetch user data.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching User Data", message: error.message });
    }
  };

  const handleSave = async () => {
    setIsConfirmSaveOpen(false);

    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/UpdateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId, 
          editorUserId: userId, 
          accessRightId: userData.role?.value || "",
          locationId: userData.location?.value || "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessModal({ isOpen: true, title: "User updated successfully!" });
        fetchUserData();
        setIsEditing(false);
      } else {
        throw new Error(data.errorMessage || "Failed to update user.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Updating User", message: error.message });
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/AccessRight/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRoleOptions(data.data.map((role) => ({ value: role.accessRightId, label: role.description })));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch roles.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Roles", message: error.message });
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setLocationOptions(data.data.map((loc) => ({ value: loc.locationId, label: loc.locationCode })));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch locations.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Locations", message: error.message });
    }
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

  const handleConfirmPasswordChange = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/ChangePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userData.username, // Using the logged-in user's username
          userEmail: userData.email, // Using the logged-in user's email
          userPassword: oldPassword, // The current password entered by the user
          newPassword: newPassword, // The new password entered by the user
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setSuccessModal({ isOpen: true, title: "Password Changed Successfully!" });
        setOldPassword("");
        setNewPassword("");
        setErrors({});
        setIsConfirmPasswordOpen(false);
        setPasswordModalOpen(false);
      } else {
        throw new Error(data.errorMessage || "Failed to change password.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Changing Password",
        message: error.message,
      });
    }
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
                disabled
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
          <label>Location ID:</label>
          <div className="profile-info-input">
            {isEditing ? (
              <Select
                className={`profile-select ${errors.locationId ? "input-error" : ""}`}
                classNamePrefix="react-select"
                value={userData.location}
                onChange={(selectedOption) => setUserData({ ...userData, location: selectedOption })}
                options={locationOptions}
                isSearchable
              />
            ) : (
              <p>{userData.location?.label}</p>
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
              type="text"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={errors.oldPassword ? "input-error" : ""}
            />
            {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}

            <input
              type="text"
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
        onConfirm={handleSave}
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
import React, { useState } from "react";
import "./css/InviteOwnerPage.css"; 
import SuccessModal from "./modals/SuccessModal";

const InviteOwnerPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    companyName: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.userEmail || !formData.companyName) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!formData.userEmail.includes("@")) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://optikposwebsiteapi.absplt.com/Users/InviteOwner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          companyName: formData.companyName,
          userName: "",
          userEmail: formData.userEmail,
          userPassword: "",
          editorUserId: "",
        }),
      });

      const inviteLink = await response.text(); 

      if (response.ok) {
        setSuccessModal({ 
          isOpen: true, 
          title: "Owner Invited Successfully!", 
          message: `Invitation Link: ${inviteLink}`, 
        });
      } else {
        setErrorMessage("Failed to send invitation. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: "" });
  };


  return (
    <div className="invite-container">
      <div className="invite-card">
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={closeSuccessModal}
      />
        <h2 className="invite-title">Invite Owner</h2>

        {errorMessage && <p className="invite-error">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="invite-form">
          <div className="invite-field">
            <label className="invite-label">Email</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="invite-input"
              required
            />
          </div>

          <div className="invite-field">
            <label className="invite-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="invite-input"
              required
            />
          </div>

          <button type="submit" className="invite-button" disabled={loading}>
            {loading ? "Processing..." : "Send Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteOwnerPage;

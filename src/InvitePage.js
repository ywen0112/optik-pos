import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/InviteUserPage.css"; 

const InvitePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isOwner, setIsOwner] = (false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const customerIdParam = queryParams.get("CustomerId");
      const userEmailParam = queryParams.get("UserEmail");
      const companyNameParm = queryParams.get("CompanyName");
      const isOwnerParm = queryParams.get("IsOwner")

      if (!customerIdParam || !userEmailParam || !companyNameParm || !isOwnerParm) {
        throw new Error("Invalid or missing invite link parameters.");
      }

      setCustomerId(customerIdParam);
      setEmail(userEmailParam);
      setCompanyName(companyNameParm);
      setIsOwner(isOwnerParm);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/RegisterUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          companyName: companyName,
          userName: userName,
          userEmail: email,
          userPassword: password,
          editorUserId: "",
          isOwner: isOwner,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate("/login");
      } else {
        throw new Error(data.errorMessage || "Failed to complete user invitation.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-user-container">
      <h2>Complete Your Registration</h2>
      {error && <p className="error-message">{error}</p>}
      <p><strong>Email:</strong> {email}</p>

      <label>Username</label>
      <input
        type="text"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <label>Password</label>
      <input
        type="text"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Complete Registration"}
      </button>
    </div>
  );
};

export default InvitePage;

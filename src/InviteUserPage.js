import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/InviteUserPage.css"; 

const InviteUserPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const customerIdParam = queryParams.get("CustomerId");
      const userEmailParam = queryParams.get("UserEmail");

      if (!customerIdParam || !userEmailParam) {
        throw new Error("Invalid or missing invite link parameters.");
      }

      setCustomerId(customerIdParam);
      setEmail(userEmailParam);
      setUsername(userEmailParam.split("@")[0]); 
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
      const response = await fetch("https://optikposbackend.absplt.com/Users/InviteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          companyName: "",
          userName: username,
          userEmail: email,
          userPassword: password,
          editorUserId: "",
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Account setup successful! Redirecting to login...");
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

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter a secure password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Complete Registration"}
      </button>
    </div>
  );
};

export default InviteUserPage;

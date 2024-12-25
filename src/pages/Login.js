import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = ({ logo }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === "admin" && password === "password") {
      localStorage.setItem("isLoggedIn", "true"); 
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Use admin/password.");
    }
  };  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-placeholder">
          {logo ? <img src={logo} alt="Logo" /> : <div className="logo-circle"></div>}
        </div>

        <h2 className="title">OPTIK POS</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="userId" className="input-label">User ID</label>
          <input
            type="text"
            id="userId"
            placeholder="Enter your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label htmlFor="password" className="input-label">Password</label>
          <div className="password-input">
            <input
              type="password"
              id="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">LOGIN</button>
        </form>

        <div className="footer">
          <p>&copy; 2025 OPTIK POS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

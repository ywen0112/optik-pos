import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import ErrorModal from "../modals/ErrorModal"; 

const Login = ({ logo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ isOpen: false, message: "" }); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError({
        isOpen: true,
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (email === "admin@example.com" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError({
        isOpen: true,
        message: "Invalid credentials. Use admin@example.com/password.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const closeErrorModal = () => {
    setError({ isOpen: false, message: "" }); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-placeholder">
          {logo ? <img src={logo} alt="Logo" /> : <div className="logo-circle"></div>}
        </div>

        <h2 className="title">OPTIK POS</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            className="login-input"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="input-label">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              <span className="material-icons">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>

          <button type="submit" className="login-button">LOGIN</button>
        </form>

        <div className="footer">
          <p>&copy; 2025 OPTIK POS. All rights reserved.</p>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={error.isOpen}
        title="Error"
        message={error.message}
        onClose={closeErrorModal}
      />
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import ErrorModal from "../modals/ErrorModal";
import CompanySelectionModal from "../modals/CompanySelectionModal"; 

const Login = ({ logo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ isOpen: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]); 
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        isOpen: true,
        message: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/GetUserLogins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          password: password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success && data.data.length > 0) {
        setCompanies(data.data);

        if (data.data.length === 1) {
          handleCompanySelection(data.data[0]);
        } else {
          setIsCompanyModalOpen(true);
        }
      } else {
        setError({
          isOpen: true,
          message: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setError({
        isOpen: true,
        message: "Failed to connect to the server. Please try again later.",
      });
    }
  };

  const handleCompanySelection = (company) => {
    localStorage.setItem("userId", company.userId);
    localStorage.setItem("customerId", company.customerId);
    localStorage.setItem("isLoggedIn", "true");

    setIsCompanyModalOpen(false);
    navigate("/dashboard");
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <div className="footer">
          <p>&copy; 2025 OPTIK POS. All rights reserved.</p>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal isOpen={error.isOpen} title="Error" message={error.message} onClose={closeErrorModal} />

      {/* ✅ New Company Selection Modal */}
      <CompanySelectionModal
        isOpen={isCompanyModalOpen}
        companies={companies}
        onSelect={handleCompanySelection}
        onCancel={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
};

export default Login;

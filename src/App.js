import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true"; // Ensure boolean logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;

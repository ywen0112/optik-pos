import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../../css/Transaction.css";
import ErrorModal from "../../components/ErrorModal";

const Transaction = () => {
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [openCounterAmount, setOpenCounterAmount] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenCounter = () => {
    if (!openCounterAmount || parseFloat(openCounterAmount) <= 0) {
      setErrorModal({
        isOpen: true,
        title: "Invalid Amount",
        message: "Please enter a valid amount to open the counter.",
      });
      return;
    }
    setIsCounterOpen(true);
    navigate("/main/transaction/cash-management"); // Navigate to cash management by default
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  if (!isCounterOpen) {
    // Step 1: Open Counter Screen
    return (
      <div className="open-counter-container">
        <h2>Open Counter</h2>
        <div className="open-counter-form">
          <input
            type="number"
            placeholder="Enter Amount"
            value={openCounterAmount}
            onChange={(e) => setOpenCounterAmount(e.target.value)}
          />
          <button className="open-counter-button" onClick={handleOpenCounter}>
            Open Counter
          </button>
        </div>
        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={handleCloseErrorModal}
        />
      </div>
    );
  }

  // Step 2: Transaction Management Screen
  return (
    <div className="transaction-container">
      <div className="transaction-sidebar">
        <button
          className={`transaction-sidebar-button ${
            location.pathname === "/main/transaction/cash-management" ? "active" : ""
          }`}
          onClick={() => navigate("/main/transaction/cash-management")}
        >
          Cash Management
        </button>
        <button
          className={`transaction-sidebar-button ${
            location.pathname === "/main/transaction/sales-invoice" ? "active" : ""
          }`}
          onClick={() => navigate("/main/transaction/sales-invoice")}
        >
          Sales Invoice
        </button>
      </div>
      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Transaction;

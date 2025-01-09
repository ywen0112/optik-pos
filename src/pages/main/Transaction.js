import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../css/Transaction.css";
import ErrorModal from "../../components/ErrorModal";

const Transaction = () => {
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [openCounterAmount, setOpenCounterAmount] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const navigate = useNavigate();

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
    navigate("/main/transaction/cash-management"); 
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

  return (
    <div className="transaction-container">
      <div className="sidebar">
        <button
          className="sidebar-button"
          onClick={() => navigate("/main/transaction/cash-management")}
        >
          Cash Management
        </button>
        <button className="sidebar-button">Sales Invoice</button>
        <button className="sidebar-button">Purchase Invoice</button>
        <button className="sidebar-button">Credit Note</button>
        <button className="sidebar-button">Close Counter</button>
      </div>
      <div className="main-content">
       <Outlet />  
      </div>
    </div>
  );
};

export default Transaction;

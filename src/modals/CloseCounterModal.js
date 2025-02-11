import React, { useState, useEffect } from "react";
import "../css/Transaction.css";

const CloseCounterModal = ({ isOpen, onClose, onCloseCounter }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError(""); // Reset error when modal opens
    }
  }, [isOpen]);

  const handleCloseCounter = () => {
    if (!amount || parseFloat(amount) < 0) {
      setError("Amount is required.");
      return;
    }
    onCloseCounter({ amount });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal-content">
        <h2>Close Counter</h2>

        <input
          type="number"
          className="transaction-modal-input"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}


        <div className="transaction-modal-buttons">
          <button className="modal-add-button" onClick={handleCloseCounter}>
            Confirm
          </button>
          <button className="modal-close-button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseCounterModal;

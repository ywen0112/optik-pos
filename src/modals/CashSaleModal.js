import React, { useState, useEffect } from "react";
import "../css/Transaction.css";

const CashSaleModal = ({ isOpen, type, onClose, onAdd }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDescription("");
      setError("");
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (!amount || parseFloat(amount) < 0) {
      setError("Amount is required.");
      return;
    }
    onAdd({ type, amount, description });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal-content">
        <h2>{type === "cashin" ? "Cash In" : "Cash Out"}</h2>

        <input
          type="number"
          className="transaction-modal-input"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}

        <textarea
          className="transaction-modal-textarea"
          placeholder="Enter Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="transaction-modal-buttons">
          <button className="modal-add-button" onClick={handleAdd}>
            Add
          </button>
          <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashSaleModal;

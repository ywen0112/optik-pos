import React from "react";
import "../css/ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-icon">
          <span className="icon">❗</span>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

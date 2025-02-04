import React from "react";
import "../css/SuccessModal.css";

const SuccessModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <span>✔</span>
        </div>
        <h3 className="success-modal-title">{title}</h3>
        <p className="success-modal-message">{message}</p>
        <button className="success-modal-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

import React from "react";
import "../css/ErrorModal.css";

const ErrorModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <h3 className="error-modal-title">{title}</h3>
        <p className="error-modal-message">{message}</p>
        <button className="error-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;

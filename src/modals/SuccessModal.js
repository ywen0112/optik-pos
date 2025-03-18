import React from "react";
import "../css/SuccessModal.css";

const SuccessModal = ({ isOpen, title, message, onClose, onExportReport, onExportReceipt, docId }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <h3 className="success-modal-title">{title}</h3>
        <p className="success-modal-message">{message}</p>
        <div className="success-modal-buttons">
          <button className="success-modal-button" onClick={onClose}>
            OK
          </button>
        </div>
        {onExportReport && docId && (
            <button className="export-report-button" onClick={onExportReport}>
              Export Job Sheet Report
            </button>
          )}
        {onExportReceipt && docId &&(
          <button className="export-report-button" onClick={onExportReceipt}>
            Export Official Receipt
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;

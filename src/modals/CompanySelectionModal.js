import React from "react";
import "../css/CompanySelectionModal.css"; 

const CompanySelectionModal = ({ isOpen, companies, onSelect, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="company-modal">
        <h3>Select Company</h3>
        <p>Please select a company to proceed:</p>

        <div className="company-list">
          {companies.map((company) => (
            <button
              key={company.customerId}
              className="company-button"
              onClick={() => onSelect(company)}
            >
              {company.companyName}
            </button>
          ))}
        </div>

        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CompanySelectionModal;

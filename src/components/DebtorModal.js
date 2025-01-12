import React, { useState } from "react";
import "../css/DebtorModal.css";

const DebtorModal = ({ isOpen, title, data, onClose, onSave, onInputChange, isViewing }) => {
  const [expandedSections, setExpandedSections] = useState({
    debtorInfo: true,
    taxEntity: false,
    latestRx: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleFetchTIN = () => {
    // Mock API call for TIN
    setTimeout(() => {
      const mockTIN = "TIN123456";
      onInputChange({
        target: { name: "tin", value: mockTIN },
      });
      alert("TIN fetched successfully: " + mockTIN);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="debtor-popup-overlay">
      <div className="debtor-popup-content">
        <h3 className="debtor-modal-title">{title}</h3>

        {/* Debtor Information Section */}
        <div className="debtor-section">
          <div
            className="debtor-section-header"
            onClick={() => toggleSection("debtorInfo")}
          >
            <h4>Debtor Information</h4>
            <span>{expandedSections.debtorInfo ? "-" : "+"}</span>
          </div>
          {expandedSections.debtorInfo && (
            <div className="debtor-section-content">
              {[
                { label: "Email Address", name: "emailAddress" },
                { label: "Mobile", name: "mobile" },
                { label: "Debtor Code", name: "debtorCode" },
                { label: "Debtor Name", name: "debtorName" },
                { label: "Debtor Type ID", name: "debtorTypeId" },
                { label: "Address 1", name: "address1" },
                { label: "Address 2", name: "address2" },
                { label: "Address 3", name: "address3" },
                { label: "Address 4", name: "address4" },
                { label: "Post Code", name: "postCode" },
                { label: "Delivery Address 1", name: "deliverAddr1" },
                { label: "Delivery Address 2", name: "deliverAddr2" },
                { label: "Delivery Address 3", name: "deliverAddr3" },
                { label: "Delivery Address 4", name: "deliverAddr4" },
                { label: "Delivery Post Code", name: "deliverPostCode" },
                { label: "Location ID", name: "locationId" },
                { label: "Sales Agent", name: "salesAgent" },
                { label: "Currency Code", name: "currencyCode" },
              ].map(({ label, name }) => (
                <div key={name} className="debtor-form-group">
                  <label className="debtor-form-label">{label}</label>
                  <input
                    className="debtor-form-input"
                    type="text"
                    name={name}
                    value={data[name] || ""}
                    onChange={onInputChange}
                    disabled={isViewing}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debtor Tax Entity Section */}
        <div className="debtor-section">
          <div
            className="debtor-section-header"
            onClick={() => toggleSection("taxEntity")}
          >
            <h4>Debtor Tax Entity</h4>
            <span>{expandedSections.taxEntity ? "-" : "+"}</span>
          </div>
          {expandedSections.taxEntity && (
            <div className="debtor-section-content">
              {[
                { label: "IC", name: "ic" },
                { label: "Name on IC", name: "nameOnIC" },
                { label: "TIN", name: "tin" },
              ].map(({ label, name }) => (
                <div key={name} className="debtor-form-group">
                  <label className="debtor-form-label">{label}</label>
                  <input
                    className="debtor-form-input"
                    type="text"
                    name={name}
                    value={data[name] || ""}
                    onChange={onInputChange}
                    disabled={isViewing || (name === "tin" && true)}
                  />
                </div>
              ))}
              {!isViewing && (
                <button
                  className="debtor-fetch-tin-button"
                  onClick={handleFetchTIN}
                >
                  Fetch TIN
                </button>
              )}
            </div>
          )}
        </div>

        {/* Debtor Latest RX Section */}
        <div className="debtor-section">
          <div
            className="debtor-section-header"
            onClick={() => toggleSection("latestRx")}
          >
            <h4>Debtor Latest RX</h4>
            <span>{expandedSections.latestRx ? "-" : "+"}</span>
          </div>
          {expandedSections.latestRx && (
            <div className="debtor-section-content">
              {[
                { label: "RX for Spectacles", name: "rxSpectacles" },
                { label: "RX for Contact Lens", name: "rxContactLens" },
                { label: "RX for K-Reading", name: "rxKReading" },
              ].map(({ label, name }) => (
                <div key={name} className="debtor-rx-group">
                  <label className="debtor-rx-label">{label}</label>
                  <textarea
                    className="debtor-rx-textarea"
                    name={name}
                    value={data[name] || ""}
                    onChange={onInputChange}
                    disabled={isViewing}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-buttons">
          {!isViewing && (
            <>
              <button className="save-button" onClick={onSave}>
              Save Changes
              </button>
              <button className="cancel-button" onClick={onClose}>
              Cancel / Close
              </button>
            </>
          )}
          {isViewing && (
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtorModal;

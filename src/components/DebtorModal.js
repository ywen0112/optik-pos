import React, { useState } from "react";
import "../css/DebtorModal.css";

const DebtorModal = ({ isOpen, title, data, onClose, onSave, onInputChange, isViewing }) => {
  const [expandedSections, setExpandedSections] = useState({
    debtorInfo: true,
    glassesProfile: false,
    contactLensProfile: false,
  });

  const [sectionData, setSectionData] = useState({ ...data });

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSaveSection = (sectionName) => {
    onSave(sectionData);
    alert(`${sectionName} section saved successfully!`);
  };

  const handleCancelSection = (sectionName) => {
    setSectionData({ ...data }); // Reset to the original data
    alert(`${sectionName} section changes discarded.`);
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
                  value={sectionData[name] || ""}
                  onChange={(e) => setSectionData({ ...sectionData, [name]: e.target.value })}
                  disabled={isViewing}
                />
              </div>
            ))}
          {/* Add "Fetch TIN" Button */}
          {!isViewing && (
          <div className="debtor-fetch-tin">
            <button
              className="debtor-fetch-tin-button"
              onClick={() => {
                const mockTIN = "TIN123456"; 
                setSectionData({ ...sectionData, tin: mockTIN });
                alert(`TIN fetched successfully: ${mockTIN}`);
              }}
            >
              Fetch TIN
            </button>
          </div>
          )}
          {!isViewing && (
            <div className="section-buttons">
              <button className="save-button" onClick={() => handleSaveSection("Debtor Information")}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={() => handleCancelSection("Debtor Information")}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>

        {/* Glasses Eye Power Profile Section */}
        <div className="debtor-section">
          <div
            className="debtor-section-header"
            onClick={() => toggleSection("glassesProfile")}
          >
            <h4>Glasses Eye Power Profile</h4>
            <span>{expandedSections.glassesProfile ? "-" : "+"}</span>
          </div>
          {expandedSections.glassesProfile && (
            <div className="debtor-section-content">
              {[{ label: "Right Eye SPH", name: "glassesRightSPH" },
                { label: "Right Eye CYL", name: "glassesRightCYL" },
                { label: "Right Eye AXIS", name: "glassesRightAXIS" },
                { label: "Left Eye SPH", name: "glassesLeftSPH" },
                { label: "Left Eye CYL", name: "glassesLeftCYL" },
                { label: "Left Eye AXIS", name: "glassesLeftAXIS" },
              ].map(({ label, name }) => (
                <div key={name} className="debtor-form-group">
                  <label className="debtor-form-label">{label}</label>
                  <input
                    className="debtor-form-input"
                    type="text"
                    name={name}
                    value={sectionData[name] || ""}
                    onChange={(e) => setSectionData({ ...sectionData, [name]: e.target.value })}
                    disabled={isViewing}
                  />
                </div>
              ))}
              {!isViewing && (
                <div className="section-buttons">
                  <button className="save-button" onClick={() => handleSaveSection("Glasses Eye Power Profile")}>
                    Save Changes
                  </button>
                  <button className="cancel-button" onClick={() => handleCancelSection("Glasses Eye Power Profile")}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Lens Eye Power Profile Section */}
        <div className="debtor-section">
          <div
            className="debtor-section-header"
            onClick={() => toggleSection("contactLensProfile")}
          >
            <h4>Contact Lens Eye Power Profile</h4>
            <span>{expandedSections.contactLensProfile ? "-" : "+"}</span>
          </div>
          {expandedSections.contactLensProfile && (
            <div className="debtor-section-content">
              {[{ label: "Right Eye SPH", name: "lensRightSPH" },
                { label: "Right Eye CYL", name: "lensRightCYL" },
                { label: "Right Eye AXIS", name: "lensRightAXIS" },
                { label: "Left Eye SPH", name: "lensLeftSPH" },
                { label: "Left Eye CYL", name: "lensLeftCYL" },
                { label: "Left Eye AXIS", name: "lensLeftAXIS" },
              ].map(({ label, name }) => (
                <div key={name} className="debtor-form-group">
                  <label className="debtor-form-label">{label}</label>
                  <input
                    className="debtor-form-input"
                    type="text"
                    name={name}
                    value={sectionData[name] || ""}
                    onChange={(e) => setSectionData({ ...sectionData, [name]: e.target.value })}
                    disabled={isViewing}
                  />
                </div>
              ))}
              {!isViewing && (
                <div className="section-buttons">
                  <button className="save-button" onClick={() => handleSaveSection("Contact Lens Eye Power Profile")}>
                    Save Changes
                  </button>
                  <button className="cancel-button" onClick={() => handleCancelSection("Contact Lens Eye Power Profile")}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtorModal;

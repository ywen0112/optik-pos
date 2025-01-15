import React, { useState } from "react";
import "../css/DebtorModal.css";

const DebtorModal = ({
  isOpen,
  title,
  data,
  onClose,
  onSave,
  onInputChange,
  isViewing,
  onOpenConfirmModal,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    debtorInfo: false,
    glassesProfile: false,
    contactLensProfile: false,
  });

  const [sectionData, setSectionData] = useState({ ...data });
  const [errors, setErrors] = useState({});

  // Define field labels
  const fieldLabels = {
    emailAddress: "Email Address",
    mobile: "Mobile",
    debtorCode: "Debtor Code",
    debtorName: "Debtor Name",
    debtorTypeId: "Debtor Type ID",
    address1: "Address 1",
    address2: "Address 2", 
    postcode: "Postcode",
    deliverAddr1: "Delivery Address 1",
    deliverPostcode: "Delivery Postcode",
    locationId: "Location ID",
    salesAgent: "Sales Agent",
    currencyCode: "Currency Code",
    ic: "IC",
    nameOnIc: "Name on IC",
    tin: "TIN",
    glassesRightSPH: "Right Eye SPH (Glasses)",
    glassesRightCYL: "Right Eye CYL (Glasses)",
    glassesRightAXIS: "Right Eye AXIS (Glasses)",
    glassesLeftSPH: "Left Eye SPH (Glasses)",
    glassesLeftCYL: "Left Eye CYL (Glasses)",
    glassesLeftAXIS: "Left Eye AXIS (Glasses)",
    lensRightSPH: "Right Eye SPH (Contact Lens)",
    lensRightCYL: "Right Eye CYL (Contact Lens)",
    lensRightAXIS: "Right Eye AXIS (Contact Lens)",
    lensLeftSPH: "Left Eye SPH (Contact Lens)",
    lensLeftCYL: "Left Eye CYL (Contact Lens)",
    lensLeftAXIS: "Left Eye AXIS (Contact Lens)",
  };

  // Define required fields for each section
  const requiredFields = {
    debtorInfo: [
      "emailAddress",
      "mobile",
      "debtorCode",
      "debtorName",
      "debtorTypeId",
      "address1",
      "postcode",
      "deliverAddr1",
      "deliverPostcode",
      "locationId",
      "salesAgent",
      "currencyCode",
      "ic",
      "nameOnIc",
      "tin",
    ],
    glassesProfile: [
      "glassesRightSPH",
      "glassesRightCYL",
      "glassesRightAXIS",
      "glassesLeftSPH",
      "glassesLeftCYL",
      "glassesLeftAXIS",
    ],
    contactLensProfile: [
      "lensRightSPH",
      "lensRightCYL",
      "lensRightAXIS",
      "lensLeftSPH",
      "lensLeftCYL",
      "lensLeftAXIS",
    ],
  };

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSaveSection = (sectionName) => {
    const newErrors = {};

    // Validate required fields for the section
    requiredFields[sectionName].forEach((field) => {
      if (!sectionData[field]) {
        newErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(sectionData);
    }
  };

  const handleCancelSection = (sectionName) => {
    onOpenConfirmModal(() => {
      setSectionData({ ...data }); // Reset to original data
      setErrors({}); // Clear errors
    });
  };

  const handleFetchTIN = () => {
    const mockTIN = "TIN123456"; // Mocked TIN for testing
    setSectionData({ ...sectionData, tin: mockTIN });
  };

  if (!isOpen) return null;

  return (
    <div className="debtor-popup-overlay">
      <div className="debtor-popup-content">
        <h3 className="debtor-modal-title">{title}</h3>

        {/* Iterate through sections */}
        {Object.keys(requiredFields).map((section) => (
          <div className="debtor-section" key={section}>
            <div
              className="debtor-section-header"
              onClick={() => toggleSection(section)}
            >
              <h4>
                {section === "debtorInfo" && "Debtor Information"}
                {section === "glassesProfile" && "Glasses Eye Power Profile"}
                {section === "contactLensProfile" &&
                  "Contact Lens Eye Power Profile"}
              </h4>
              <span>{expandedSections[section] ? "-" : "+"}</span>
            </div>
            {expandedSections[section] && (
              <div className="debtor-section-content">
                {requiredFields[section].map((name) => (
                  <div key={name} className="debtor-form-group">
                    <label className="debtor-form-label">
                      {fieldLabels[name]}{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      className="debtor-form-input"
                      type="text"
                      name={name}
                      value={sectionData[name] || ""}
                      onChange={(e) => {
                        setSectionData({
                          ...sectionData,
                          [name]: e.target.value,
                        });
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          [name]: "",
                        })); // Clear error on input
                      }}
                      disabled={isViewing || name === "tin"}
                      readOnly={name === "tin"}
                    />
                    {errors[name] && (
                      <p className="error-message">{errors[name]}</p>
                    )}
                  </div>
                ))}
                 {section === "debtorInfo" && (
                  <div className="debtor-form-group">
                    <label className="debtor-form-label">
                      {fieldLabels["address2"]}
                    </label>
                    <input
                      className="debtor-form-input"
                      type="text"
                      name="address2"
                      value={sectionData["address2"] || ""}
                      onChange={(e) =>
                        setSectionData({
                          ...sectionData,
                          address2: e.target.value,
                        })
                      }
                      disabled={isViewing}
                    />
                  </div>
                )}
                {!isViewing && section === "debtorInfo" && (
                  <div className="debtor-fetch-tin">
                    <button
                      className="debtor-fetch-tin-button"
                      onClick={handleFetchTIN}
                    >
                      Fetch TIN
                    </button>
                  </div>
                )}
                {!isViewing && (
                  <div className="section-buttons">
                    <button
                      className="save-button"
                      onClick={() => handleSaveSection(section)}
                    >
                      Save Changes
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelSection(section)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

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

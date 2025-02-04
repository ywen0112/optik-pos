import React, { useState, useEffect } from "react";
import "../css/DebtorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";

const DebtorModal = ({ isOpen, title, data, onClose, onSave, onInputChange, isViewing }) => {
  const [expandedSections, setExpandedSections] = useState({
    debtorInfo: false,
    glassesProfile: false,
    contactLensProfile: false,
  });

  const [sectionData, setSectionData] = useState({ ...data });
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    setSectionData({ ...data }); 
  }, [data]);

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const validateFields = (fields) => {
    const validationErrors = {};
    fields.forEach(({ label, name }) => {
      if (!sectionData[name]) {
        validationErrors[name] = `${label} is required.`;
      }
    });
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSaveSection = (sectionName) => {
    let fieldsToValidate = [];

    if (sectionName === "Debtor Information") {
      fieldsToValidate = [
        { label: "Email Address", name: "emailAddress" },
        { label: "Mobile", name: "mobile" },
        { label: "Debtor Code", name: "debtorCode" },
        { label: "Debtor Name", name: "debtorName" },
        { label: "Debtor Type ID", name: "debtorTypeId" },
        { label: "Address 1", name: "address1" },
        { label: "Postcode", name: "postCode" },
        { label: "Delivery Address 1", name: "deliverAddr1" },
        { label: "Delivery Postcode", name: "deliverPostCode" },
        { label: "Location ID", name: "locationId" },
        { label: "Sales Agent", name: "salesAgent" },
        { label: "Currency Code", name: "currencyCode" },
        { label: "IC", name: "ic" },
        { label: "Name on IC", name: "nameOnIC" },
        { label: "TIN", name: "tin" },
      ];
    } else if (sectionName === "Glasses Profile") {
      fieldsToValidate = [
        { label: "Right Eye SPH", name: "glassesRightSPH" },
        { label: "Right Eye CYL", name: "glassesRightCYL" },
        { label: "Right Eye AXIS", name: "glassesRightAXIS" },
        { label: "Left Eye SPH", name: "glassesLeftSPH" },
        { label: "Left Eye CYL", name: "glassesLeftCYL" },
        { label: "Left Eye AXIS", name: "glassesLeftAXIS" },
      ];
    } else if (sectionName === "Contact Lens Profile") {
      fieldsToValidate = [
        { label: "Right Eye SPH", name: "lensRightSPH" },
        { label: "Right Eye CYL", name: "lensRightCYL" },
        { label: "Right Eye AXIS", name: "lensRightAXIS" },
        { label: "Left Eye SPH", name: "lensLeftSPH" },
        { label: "Left Eye CYL", name: "lensLeftCYL" },
        { label: "Left Eye AXIS", name: "lensLeftAXIS" },
      ];
    }

    const validationErrors = validateFields(fieldsToValidate);
    if (Object.keys(validationErrors).length === 0) {
      onSave(sectionData);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };
  const handleCancelSection = (sectionName) => {
    const action = () => {
      setSectionData({ ...data }); // Reset data to the original state
      setErrors({}); // Clear errors
    };

    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setIsConfirmOpen(false);
  };
  
  if (!isOpen) return null;



  return (
    <div className="debtor-popup-overlay">
      <div className="debtor-popup-content">
        <h3 className="debtor-modal-title">{title}</h3>

        {[
          {
            name: "Debtor Information",
            key: "debtorInfo",
            fields: [
              { label: "Email Address", name: "emailAddress" },
              { label: "Mobile", name: "mobile" },
              { label: "Debtor Code", name: "debtorCode" },
              { label: "Debtor Name", name: "debtorName" },
              {
                label: "Debtor Type ID",
                name: "debtorTypeId",
                type: "select", 
                options: [
                  { label: "DT001", value: "DT001" },
                  { label: "DT002", value: "DT002" },
                  { label: "DT003", value: "DT003" },
                ],
              }, 
             { label: "Address 1", name: "address1" },
              { label: "Address 2", name: "address2", required: false },
              { label: "Address 3", name: "address3", required: false },
              { label: "Address 4", name: "address4", required: false },
              { label: "Postcode", name: "postCode" },
              { label: "Delivery Address 1", name: "deliverAddr1" },
              { label: "Delivery Address 2", name: "deliverAddr2", required: false },
              { label: "Delivery Address 3", name: "deliverAddr3", required: false },
              { label: "Delivery Address 4", name: "deliverAddr4", required: false },
              { label: "Delivery Postcode", name: "deliverPostCode" },
              {
                label: "Location ID",
                name: "locationId",
                type: "select", 
                options: [
                  { label: "L001", value: "L001" },
                  { label: "L002", value: "L002" },
                  { label: "L003", value: "L003" },
                ],
              }, 
              { label: "Sales Agent", name: "salesAgent" },
              { 
                label: "Currency Code", 
                name: "currencyCode",
                type: "select",
                options: [
                  {label: "USD", value: "USD"},
                  {label: "EUR", value: "EUR"},
                  {label: "MYR", value: "MYR"},
                ] 
              },
              { label: "IC", name: "ic" },
              { label: "Name on IC", name: "nameOnIC" },
              { label: "TIN", name: "tin" },
            ],
          },
          {
            name: "Glasses Profile",
            key: "glassesProfile",
            fields: [
              { label: "Right Eye SPH", name: "glassesRightSPH" },
              { label: "Right Eye CYL", name: "glassesRightCYL" },
              { label: "Right Eye AXIS", name: "glassesRightAXIS" },
              { label: "Left Eye SPH", name: "glassesLeftSPH" },
              { label: "Left Eye CYL", name: "glassesLeftCYL" },
              { label: "Left Eye AXIS", name: "glassesLeftAXIS" },
            ],
          },
          {
            name: "Contact Lens Profile",
            key: "contactLensProfile",
            fields: [
              { label: "Right Eye SPH", name: "lensRightSPH" },
              { label: "Right Eye CYL", name: "lensRightCYL" },
              { label: "Right Eye AXIS", name: "lensRightAXIS" },
              { label: "Left Eye SPH", name: "lensLeftSPH" },
              { label: "Left Eye CYL", name: "lensLeftCYL" },
              { label: "Left Eye AXIS", name: "lensLeftAXIS" },
            ],
          },
        ].map(({ name, key, fields, specialField }) => (
          <div className="debtor-section" key={key}>
            <div
              className="debtor-section-header"
              onClick={() => toggleSection(key)}
            >
              <h4>{name}</h4>
              <span>{expandedSections[key] ? "-" : "+"}</span>
            </div>
            {expandedSections[key] && (
              <div>
                <div className="debtor-section-content">
                {fields.map(({ label, name, type = "text", options, required = true }) => (
                  <div key={name} className="debtor-form-group">
                    <label className="debtor-form-label">
                      {label} {required && <span className="required">*</span>}
                    </label>
                    {type === "select" ? (
                      <select
                        className="debtor-form-input"
                        name={name}
                        value={sectionData[name] || ""}
                        onChange={(e) =>
                          setSectionData({ ...sectionData, [name]: e.target.value })
                        }
                        disabled={isViewing}
                      >
                        <option value="">Select {label}</option>
                        {options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="debtor-form-input"
                        type={type}
                        name={name}
                        value={sectionData[name] || ""}
                        onChange={(e) =>
                          setSectionData({ ...sectionData, [name]: e.target.value })
                        }
                        disabled={isViewing}
                      />
                    )}
                    {errors[name] && <p className="error-message">{errors[name]}</p>}
                  </div>
                ))}
                  {specialField}
                </div>
                {!isViewing && (
                  <div className="debtor-section-buttons">
                    <button
                      className="save-button"
                      onClick={() => handleSaveSection(name)}
                    >
                      Save Changes
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelSection(name)}
                    >
                      Cancel / Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          title="Confirm Action"
          message="Are you sure you want to cancel and discard unsaved changes?"
          onConfirm={handleConfirmAction}
          onCancel={() => setIsConfirmOpen(false)}
        />

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

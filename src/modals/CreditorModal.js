import React, { useState, useEffect } from "react";
import "../css/CreditorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";

const CreditorModal = ({
  isOpen,
  title,
  data,
  onClose,
  onSave,
  isViewing,
}) => {
  const [sectionData, setSectionData] = useState({ ...data });
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSectionData({ ...data });
      setErrors({});
    } 
  }, [isOpen, data]);

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

  const handleSave = () => {
    const fieldsToValidate = [
      { label: "Creditor Code", name: "creditorCode" },
      {
        label: "Creditor Type ID",
        name: "creditorTypeId",
        type: "select",
        options: [
          { label: "CT001", value: "CT001" },
          { label: "CT002", value: "CT002" },
          { label: "CT003", value: "CT003" },
        ],
      },
      { label: "Company Name", name: "companyName" },
      { label: "Registration Number", name: "registerNo" },
      { label: "Mobile", name: "mobile" },
      { label: "Fax 1", name: "fax1" },
      { label: "Email Address", name: "emailAddress" },
      { label: "Address", name: "address1" },
      { label: "Postcode", name: "postcode" },
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
      { label: "Attention", name: "attention" },
      { label: "Nature of Business", name: "natureOfBusiness" },
      { label: "Purchase Agent", name: "purchaseAgent" },
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
      { label: "Display Term", name: "displayTerm" },
      { label: "TIN", name: "tin" },
    ];

    const validationErrors = validateFields(fieldsToValidate);
    if (Object.keys(validationErrors).length === 0) {
      onSave(sectionData);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };

  const handleCancelSection = () => {
    const action = () => {
      setSectionData({ ...data }); 
      setErrors({});
      onClose();
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
    <div className="creditor-popup-overlay">
      <div className="creditor-popup-content">
        <h3 className="creditor-modal-title">{title}</h3>

        <div className="creditor-section-content">
          {[
            { label: "Creditor Code", name: "creditorCode" },
            {
              label: "Creditor Type ID",
              name: "creditorTypeId",
              type: "select",
              options: [
                { label: "CT001", value: "CT001" },
                { label: "CT002", value: "CT002" },
                { label: "CT003", value: "CT003" },
              ],
            },
            { label: "Company Name", name: "companyName" },
            { label: "Registration Number", name: "registerNo" },
            { label: "Mobile", name: "mobile" },
            { label: "Phone 1", name: "phone1", required: false },
            { label: "Phone 2", name: "phone2", required: false },
            { label: "Fax 1", name: "fax1" },
            { label: "Fax 2", name: "fax2", required: false },
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
            { label: "Attention", name: "attention" },
            { label: "Nature of Business", name: "natureOfBusiness" },
            { label: "Purchase Agent", name: "purchaseAgent" },
            { label: "Display Term", name: "displayTerm" },
            { label: "Postcode", name: "postcode" },
            { label: "Address", name: "address1" },
            { label: "Remark", name: "remark" },
            { label: "Is Group Company", name: "isGroupCompany", type: "checkbox" },
          ].map(({ label, name, type = "text", options}) => (
            <div key={name} className="creditor-form-group">
              {type === "checkbox" ? (
                <div className="checkbox-container">
                  <input
                    className="creditor-form-checkbox"
                    type="checkbox"
                    name={name}
                    checked={sectionData[name] || false}
                    onChange={(e) =>
                      setSectionData({ ...sectionData, [name]: e.target.checked })
                    }
                    disabled={isViewing}
                  />
                  <label>{label}</label>
                </div>
              ) : (
                <>
                  <label className="creditor-form-label">
                    {label}
                  </label>
                  {type === "select" ? (
                    <select
                      className="creditor-form-input"
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
                  ) : name === "remark" || name.includes("address1") ? ( // Apply textarea for Remark & Address fields
                    <textarea
                      className="creditor-form-textarea"
                      name={name}
                      value={sectionData[name] || ""}
                      onChange={(e) =>
                        setSectionData({ ...sectionData, [name]: e.target.value })
                      }
                      disabled={isViewing}
                      rows={3} 
                    />
                  ) : (
                    <input
                      className="creditor-form-input"
                      type={type}
                      name={name}
                      value={sectionData[name] || ""}
                      onChange={(e) =>
                        setSectionData({ ...sectionData, [name]: e.target.value })
                      }
                      disabled={isViewing}
                    />
                  )}
                </>
              )}
              {errors[name] && <p className="error-message">{errors[name]}</p>}
            </div>
          ))}
        </div>

        <div className="section-buttons">
          {!isViewing && (
            <>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={handleCancelSection}>
                Cancel / Close
              </button>
            </>
          )}
          {isViewing && (
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default CreditorModal;

import React, { useState, useEffect } from "react";
import "../css/CreditorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";

const CreditorModal = ({
  isOpen,
  title,
  data,
  onClose,
  onSave,
  isViewing,
  creditorTypeOptions
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
      { label: "Company Name", name: "companyName" },
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
              label: "Creditor Type Code",
              name: "creditorTypeId",
              type: "select",
              options: creditorTypeOptions,
            },
            { label: "Company Name", name: "companyName" },
            { label: "Phone 1", name: "phone1" },
            { label: "Phone 2", name: "phone2"},
            { label: "Mobile", name: "mobile" },
            { label: "Postcode", name: "postcode" },
            { label: "Address1", name: "address1" },
            { label: "Address2", name: "address2" },
            { label: "Address3", name: "address3" },
            { label: "Address4", name: "address4" },
          ].map(({ label, name, type = "text", options }) => (
            <div key={name} className="creditor-form-group">
              <label className="creditor-form-label">
                {label}
              </label>
              {type === "select" ? (
                <Select
                  name={name}
                  value={options.find((option) => option.value === sectionData[name]) || ""}
                  onChange={(selectedOption) =>
                    setSectionData({ ...sectionData, [name]: selectedOption.value })
                  }
                  options={options}
                  isDisabled={isViewing}
                  isSearchable={true}
                  placeholder={`Select ${label}`}
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
